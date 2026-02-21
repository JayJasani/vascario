import type { AnalyticsProvider } from "./provider";
import type { AnalyticsEventMap, AnalyticsEventName } from "./types";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function sendViaGtag<E extends AnalyticsEventName>(
  event: E,
  params: AnalyticsEventMap[E],
) {
  if (typeof window === "undefined" || !window.gtag) return false;
  try {
    window.gtag("event", event, params as Record<string, unknown>);
    return true;
  } catch {
    return false;
  }
}

/**
 * GA4 provider that sends events to both dataLayer and gtag.
 *
 * Events are sent via:
 * 1. gtag() - Direct GA4 delivery (when NEXT_PUBLIC_GA4_MEASUREMENT_ID is set)
 * 2. dataLayer - GTM can forward to GA4 if configured
 *
 * Set NEXT_PUBLIC_GA4_MEASUREMENT_ID in .env.local (e.g. G-XXXXXXXXXX) for events to trigger.
 * Without it, only GTM loads; GTM must then be configured with a GA4 tag and triggers.
 */
export class GA4Provider implements AnalyticsProvider {
  private readonly ECOMMERCE_EVENTS = new Set<string>([
    "view_item_list",
    "select_item",
    "view_item",
    "add_to_cart",
    "remove_from_cart",
    "view_cart",
    "begin_checkout",
    "add_shipping_info",
    "add_payment_info",
    "purchase",
    "add_to_wishlist",
    "remove_from_wishlist",
  ]);

  init(): void {
    if (typeof window === "undefined") return;
    const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    if (!ga4Id && process.env.NODE_ENV === "development") {
      console.warn(
        "[Analytics] NEXT_PUBLIC_GA4_MEASUREMENT_ID is not set. GA4 events will not trigger. " +
          "Add it to .env.local (e.g. G-XXXXXXXXXX) or configure GTM to forward events to GA4.",
      );
    }
  }

  track<E extends AnalyticsEventName>(
    event: E,
    params: AnalyticsEventMap[E],
  ): void {
    // 1. Send via gtag when available (direct GA4 — most reliable)
    const sentViaGtag = sendViaGtag(event, params);

    // 2. Also push to dataLayer for GTM
    if (this.ECOMMERCE_EVENTS.has(event)) {
      pushToDataLayer({ ecommerce: null });
      pushToDataLayer({
        event,
        ecommerce: params,
      });
    } else {
      pushToDataLayer({ event, ...params });
    }

    // Debug: log in dev when gtag isn't available
    if (
      !sentViaGtag &&
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.debug(`[Analytics] Event "${event}" sent to dataLayer (gtag not loaded). Check NEXT_PUBLIC_GA4_MEASUREMENT_ID.`, params);
    }
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    pushToDataLayer({
      event: "user_identify",
      user_id: userId,
      ...traits,
    });
  }

  reset(): void {
    pushToDataLayer({
      event: "user_reset",
      user_id: undefined,
    });
  }
}
