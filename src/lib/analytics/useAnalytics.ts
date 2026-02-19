"use client";

import { useCallback, useMemo } from "react";
import { getAnalytics } from "./index";
import type { AnalyticsEventMap, AnalyticsEventName } from "./types";

/**
 * React hook that returns a stable `track` function.
 * Use in components that need to fire multiple different events.
 */
export function useAnalytics() {
  const track = useCallback(
    <E extends AnalyticsEventName>(event: E, params: AnalyticsEventMap[E]) => {
      getAnalytics().track(event, params);
    },
    [],
  );

  return useMemo(() => ({ track }), [track]);
}
