"use server";

import { getString } from "@/lib/parse-form";
import { createContactSubmission } from "@/lib/firebase-helpers";

export type ContactFormState = { success?: boolean; error?: string } | null;

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const firstName = getString(formData, "firstName");
  const lastName = getString(formData, "lastName");
  const email = getString(formData, "email");
  const query = getString(formData, "query");

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
