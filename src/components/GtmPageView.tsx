"use client";

import { useEffect } from "react";
import { trackGTMEvent } from "@/lib/gtmEvents";

export function GtmPageView() {
  useEffect(() => {
    trackGTMEvent("page_view", {
      page_path: window.location.pathname,
    });
  }, []);

  return null;
}

