"use server";

import { createBackInStockNotification } from "@/lib/repositories";

export type BackInStockState = { success?: boolean; alreadySubscribed?: boolean; error?: string } | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeBackInStock(
    _prev: BackInStockState,
    formData: FormData
): Promise<BackInStockState> {
    const email = (formData.get("email") as string)?.trim?.();
    const productId = (formData.get("productId") as string)?.trim?.();
    const productSlug = (formData.get("productSlug") as string)?.trim?.();
    const size = (formData.get("size") as string)?.trim?.() || null;

    if (!email) return { error: "Please enter your email." };
    if (!EMAIL_REGEX.test(email)) return { error: "Please enter a valid email address." };
    if (!productId || !productSlug) return { error: "Invalid product. Please refresh and try again." };

    try {
        const created = await createBackInStockNotification({
            email: email.toLowerCase(),
            productId,
            productSlug,
            size: size || null,
        });
        if (created) return { success: true };
        return { alreadySubscribed: true };
    } catch (err) {
        console.error("Back-in-stock subscription error:", err);
        return { error: "Something went wrong. Please try again later." };
    }
}
