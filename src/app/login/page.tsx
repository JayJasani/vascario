import { getPageMetadata } from "@/lib/seo-config";
import LoginPageClient from "./LoginPageClient";

export const metadata = getPageMetadata("login");

export default function LoginPage() {
  return <LoginPageClient />;
}

