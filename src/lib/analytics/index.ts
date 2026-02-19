import type { AnalyticsProvider } from "./provider";
import { GA4Provider } from "./ga4-provider";

let _instance: AnalyticsProvider | null = null;

/**
 * Returns the singleton analytics provider.
 *
 * To swap to a different backend (Mixpanel, Segment, PostHog, etc.),
 * replace the `GA4Provider` instantiation below with your new provider
 * that implements `AnalyticsProvider`.
 */
export function getAnalytics(): AnalyticsProvider {
  if (!_instance) {
    _instance = new GA4Provider();
    _instance.init();
  }
  return _instance;
}

export { type AnalyticsProvider } from "./provider";
export * from "./types";
export * from "./ecommerce";
