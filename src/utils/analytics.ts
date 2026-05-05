type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: EventParams = {}) {
  void import("react-ga4").then(({ default: ReactGA }) => {
    ReactGA.event(name, params);
  });
}
