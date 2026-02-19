import { getPageMetadata, SEO_BASE } from "@/lib/seo-config";
import OrderSuccessPageClient from "./OrderSuccessPageClient";

export const metadata = getPageMetadata("orderSuccess", {
  url: `${SEO_BASE.siteUrl}/order-success`,
});

export default function OrderSuccessPage() {
  return <OrderSuccessPageClient />;
}

