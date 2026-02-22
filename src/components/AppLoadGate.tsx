"use client";

import { useEffect } from "react";

const LOADING_ID = "app-initial-loading";

export function AppLoadGate() {
  useEffect(() => {
    const el = document.getElementById(LOADING_ID);
    if (el) {
      el.classList.add("app-loading-fade-out");
    }
  }, []);

  return null;
}
