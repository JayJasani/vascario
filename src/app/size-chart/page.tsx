import { getPageMetadata, SEO_BASE } from "@/lib/seo-config";
export const metadata = getPageMetadata("sizeChart", {
  url: `${SEO_BASE.siteUrl}/size-chart`,
});

import SizeChartPageClient from "./SizeChartPageClient";

export default function SizeChartPage() {
  return <SizeChartPageClient />;
}
