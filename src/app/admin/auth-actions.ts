"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const password = formData.get("password") as string;
    const secret = process.env.ADMIN_SECRET;

    if (!secret || password !== secret) {
        return { error: "Invalid access code." };
    }

    const cookieStore = await cookies();
    cookieStore.set("vascario-admin-token", secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect("/admin");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("vascario-admin-token");
    redirect("/admin/login");
}
