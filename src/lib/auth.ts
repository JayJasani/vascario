import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side auth guard for admin pages.
 * Call this at the top of any admin server component that needs protection.
 * Returns true if authenticated.
 */
export async function requireAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("vascario-admin-token")?.value;
    const secret = process.env.ADMIN_SECRET;

    if (!secret || token !== secret) {
        redirect("/admin/login");
    }

    return true;
}

/**
 * Check if user is authenticated (non-redirecting version).
 */
export async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("vascario-admin-token")?.value;
    const secret = process.env.ADMIN_SECRET;
    return !!(secret && token === secret);
}
