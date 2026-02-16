"use server";

import { createContactSubmission } from "@/lib/firebase-helpers";

export type ContactFormState = { success?: boolean; error?: string } | null;

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const query = (formData.get("query") as string)?.trim();

  if (!firstName || !lastName || !email || !query) {
    return { error: "Please fill in all fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    await createContactSubmission({
      firstName,
      lastName,
      email,
      query,
    });
    return { success: true };
  } catch (err) {
    console.error("Contact form submission error:", err);
    return { error: "Something went wrong. Please try again or email us directly." };
  }
}
