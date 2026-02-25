import { getPageMetadata } from "@/lib/seo-config";
export const metadata = getPageMetadata("profile");

import ProfilePageClient from "./ProfilePageClient";

export default function ProfilePage() {
  return <ProfilePageClient />;
}
