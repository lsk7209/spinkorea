type EventValue = string | number | boolean | undefined;
type EventParams = Record<string, EventValue>;

/**
 * Parameter names that could carry user input or share state. They are
 * dropped even if a caller passes them by mistake (SPK2-11/14).
 */
const FORBIDDEN_PARAM_KEYS = new Set(["items", "item", "result", "text", "input", "password", "s", "state", "query"]);

let analyticsReady: Promise<boolean> | null = null;

/**
 * Initialise GA lazily. A blocked or failed script load resolves to `false`
 * so tools keep working and no unhandled rejection is raised.
 */
export function initializeAnalytics(measurementId: string): Promise<boolean> {
  if (!analyticsReady) {
    analyticsReady = import("react-ga4")
      .then(({ default: ReactGA }) => {
        ReactGA.initialize(measurementId, {
          gtagOptions: { send_page_view: false },
        });
        return true;
      })
      .catch(() => false);
  }

  return analyticsReady;
}

/** Strip query/hash so only the canonical route identifier is reported. */
export function normalizeRoutePath(path: string): string {
  const withoutHash = path.split("#")[0] ?? "";
  const withoutQuery = withoutHash.split("?")[0] ?? "";
  return withoutQuery || "/";
}

/** Stable tool identifier derived from its route, e.g. "/tools/coin-flip" -> "coin-flip". */
export function toolIdFromPath(path: string): string {
  const normalized = normalizeRoutePath(path);
  if (normalized === "/" || normalized.startsWith("/spinflow")) return "roulette";
  return normalized.split("/").filter(Boolean).pop() ?? "roulette";
}

/** Common event envelope shared by every tool event. */
export function buildToolEnvelope(toolPath: string, toolId?: string): { tool_id: string; tool_path: string } {
  const tool_path = normalizeRoutePath(toolPath);
  return { tool_id: toolId ?? toolIdFromPath(tool_path), tool_path };
}

export function sanitizeEventParams(params: EventParams): EventParams {
  const safe: EventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (FORBIDDEN_PARAM_KEYS.has(key) || value === undefined) continue;
    safe[key] = value;
  }
  return safe;
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (!analyticsReady) return;
  const safeParams = sanitizeEventParams(params);

  void analyticsReady
    .then(async (ready) => {
      if (!ready) return;
      const { default: ReactGA } = await import("react-ga4");
      ReactGA.event(name, safeParams);
    })
    .catch(() => {
      // Analytics must never break a tool.
    });
}

export function trackPageView(path: string, title: string | undefined = document.title) {
  const pagePath = normalizeRoutePath(path);
  trackEvent("page_view", {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: title || undefined,
  });
}

export function trackToolCompleted(toolPath: string, resultType: string, extra: EventParams = {}) {
  trackEvent("tool_result_viewed", {
    ...buildToolEnvelope(toolPath),
    result_type: resultType,
    ...extra,
  });
}
