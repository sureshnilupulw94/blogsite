/* Client-side analytics helper — anonymous, aggregate, DNT-respecting. */

type EventPayload = Record<string, unknown>;

function allowed() {
  if (typeof window === "undefined") return false;
  if (navigator.doNotTrack === "1") return false;
  return true;
}

export function track(name: string, data?: EventPayload) {
  if (!allowed()) return;
  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "event", name, ...sanitize(data) }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the site */
  }
}

function sanitize(data?: EventPayload): EventPayload {
  if (!data) return {};
  const out: EventPayload = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "string") out[k] = v.slice(0, 200);
    else if (typeof v === "number" || typeof v === "boolean") out[k] = v;
  }
  return out;
}
