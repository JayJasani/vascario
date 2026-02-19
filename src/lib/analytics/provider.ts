import type { AnalyticsEventMap, AnalyticsEventName } from "./types";

/**
 * Abstract analytics provider interface.
 * Implement this to add a new analytics backend (GA4, Mixpanel, Segment, PostHog, etc.).
 */
export interface AnalyticsProvider {
  /** Initialize the provider (called once on app boot). */
  init(): void;

  /** Track a named event with typed parameters. */
  track<E extends AnalyticsEventName>(
    event: E,
    params: AnalyticsEventMap[E],
  ): void;

  /** Identify a user (e.g. after login). */
  identify(userId: string, traits?: Record<string, unknown>): void;

  /** Reset identity (e.g. after logout). */
  reset(): void;
}
