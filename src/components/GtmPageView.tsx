"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function GtmPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    trackPageView({
      page_path: pathname + (search ? `?${search}` : ""),
      page_title: document.title,
      page_search: search || undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
