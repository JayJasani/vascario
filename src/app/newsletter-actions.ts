"use server";

import { getString } from "@/lib/parse-form";
import { createNewsletterSubscription } from "@/lib/firebase-helpers";

export type NewsletterFormState = { success?: boolean; error?: string } | null;

export async function subscribeToNewsletter(
  formData: FormData
): Promise<NewsletterFormState> {
  const email = getString(formData, "email");

  if (!email) {
    return { error: "Please enter your email." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await createNewsletterSubscription(email.toLowerCase());
    return { success: true };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { error: "Something went wrong. Please try again later." };
  }
}

