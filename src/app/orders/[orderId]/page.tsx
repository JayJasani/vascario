import { getPageMetadata } from "@/lib/seo-config";
import OrderDetailPageClient from "./OrderDetailPageClient";

export const metadata = getPageMetadata("orders");

export default function OrderDetailPage() {
  return <OrderDetailPageClient />;
}

