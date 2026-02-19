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

/**
 * GA4 provider that pushes events to `window.dataLayer`.
 * 
 * Events are sent to both:
 * 1. GTM (via dataLayer) - GTM forwards to GA4 if configured
 * 2. Direct GA4 (via gtag) - Direct integration via GoogleTagManager component
 *
 * GA4 e-commerce events automatically clear the previous ecommerce object
 * before pushing new data (per Google's recommendation).
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
    // GTM script is already loaded by GoogleTagManager component.
    // Nothing extra needed here.
  }

  track<E extends AnalyticsEventName>(
    event: E,
    params: AnalyticsEventMap[E],
  ): void {
    if (this.ECOMMERCE_EVENTS.has(event)) {
      // Clear previous ecommerce data per GA4 best practice
      pushToDataLayer({ ecommerce: null });
      pushToDataLayer({
        event,
        ecommerce: params,
      });
    } else {
      pushToDataLayer({ event, ...params });
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
