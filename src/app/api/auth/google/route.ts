import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const redirect = url.searchParams.get("redirect") ?? "/";

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Google client ID is not configured" },
      { status: 500 },
    );
  }

  const origin = url.origin;
  const redirectUri = `${origin}/gauthcallback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    // We reuse state to carry the final in-app redirect path.
    state: redirect || "/",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}

