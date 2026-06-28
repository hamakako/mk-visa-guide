type RateEntry = { count: number; resetAt: number };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 10;
const store = new Map<string, RateEntry>();

export function checkRateLimit(identifier: string) {
  const now = Date.now();
  const existing = store.get(identifier);

  if (!existing || existing.resetAt <= now) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - existing.count, resetAt: existing.resetAt };
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
}
