import { getPageMetadata } from "@/lib/seo-config";
import OrdersPageClient from "./OrdersPageClient";

export const metadata = getPageMetadata("orders");

export default function OrdersPage() {
  return <OrdersPageClient />;
}

