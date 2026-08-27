type EventParams = Record<string, string | number | boolean | undefined>;

let analyticsReady: Promise<void> | null = null;

export function initializeAnalytics(measurementId: string) {
  if (!analyticsReady) {
    analyticsReady = import("react-ga4").then(({ default: ReactGA }) => {
      ReactGA.initialize(measurementId, {
        gtagOptions: { send_page_view: false },
      });
    });
  }

  return analyticsReady;
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (!analyticsReady) return;

  void analyticsReady.then(async () => {
    const { default: ReactGA } = await import("react-ga4");
    ReactGA.event(name, params);
  });
}

export function trackPageView(path: string) {
  trackEvent("page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}

export function trackToolCompleted(toolPath: string, resultType: string) {
  trackEvent("tool_result_viewed", {
    tool_path: toolPath,
    result_type: resultType,
  });
}
