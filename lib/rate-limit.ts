type Entry = { count: number; resetAt: number };

const entries = new Map<string, Entry>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  for (const [entryKey, entry] of entries) {
    if (entry.resetAt <= now) entries.delete(entryKey);
  }
  const current = entries.get(key);
  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1), retryAfter: Math.ceil(windowMs / 1000) };
  }
  current.count += 1;
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function resetRateLimits() {
  entries.clear();
}
