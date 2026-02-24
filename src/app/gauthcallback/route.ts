import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state") ?? "/";

  const origin = url.origin;
  const safeRedirect = typeof state === "string" && state.startsWith("/") ? state : "/";

  if (error || !code) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("error", "google_auth_failed");
    redirectUrl.searchParams.set("redirect", safeRedirect);
    return NextResponse.redirect(redirectUrl);
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("error", "google_config");
    redirectUrl.searchParams.set("redirect", safeRedirect);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/gauthcallback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const redirectUrl = new URL("/login", origin);
      redirectUrl.searchParams.set("error", "google_token_exchange_failed");
      redirectUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(redirectUrl);
    }

    const tokenJson = (await tokenResponse.json()) as {
      access_token?: string;
      id_token?: string;
    };

    const accessToken = tokenJson.access_token;

    if (!accessToken) {
      const redirectUrl = new URL("/login", origin);
      redirectUrl.searchParams.set("error", "google_missing_access_token");
      redirectUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(redirectUrl);
    }

    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!userInfoResponse.ok) {
      const redirectUrl = new URL("/login", origin);
      redirectUrl.searchParams.set("error", "google_userinfo_failed");
      redirectUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(redirectUrl);
    }

    const userInfo = (await userInfoResponse.json()) as {
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    const email = userInfo.email;
    if (!email) {
      const redirectUrl = new URL("/login", origin);
      redirectUrl.searchParams.set("error", "google_missing_email");
      redirectUrl.searchParams.set("redirect", safeRedirect);
      return NextResponse.redirect(redirectUrl);
    }

    const adminAuth = getAuth();
    let userRecord;

    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "auth/user-not-found") {
        userRecord = await adminAuth.createUser({
          email,
          displayName: userInfo.name,
          photoURL: userInfo.picture,
          emailVerified: true,
        });
      } else {
        throw e;
      }
    }

    const customToken = await adminAuth.createCustomToken(userRecord.uid, {
      provider: "google",
    });

    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("googleCustomToken", customToken);
    redirectUrl.searchParams.set("redirect", safeRedirect);

    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    console.error("Google OAuth callback error:", e);
    const redirectUrl = new URL("/login", origin);
    redirectUrl.searchParams.set("error", "google_auth_failed");
    redirectUrl.searchParams.set("redirect", safeRedirect);
    return NextResponse.redirect(redirectUrl);
  }
}

