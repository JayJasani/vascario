declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

function pushToDataLayer(event: Record<string, any>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function trackGTMEvent(
  event: string,
  params: Record<string, any> = {},
): void {
  pushToDataLayer({
    event,
    ...params,
  });
}

