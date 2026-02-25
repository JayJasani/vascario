/**
 * @deprecated Use `@/lib/analytics` instead.
 * This file re-exports a backward-compatible `trackGTMEvent` for any remaining callers.
 */
import { getAnalytics } from "./analytics";

export function trackGTMEvent(
  event: string,
  params: Record<string, unknown> = {},
): void {
  getAnalytics().track(event as never, params as never);
}
