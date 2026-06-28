import { VisaCheckInput, VisaResult } from "@/lib/visa-schema";

type CacheEntry = { result: VisaResult; expiresAt: number };
type BudgetState = { date: string; count: number };

const globalStore = globalThis as typeof globalThis & {
  __mkVisaCache?: Map<string, CacheEntry>;
  __mkVisaPending?: Map<string, Promise<VisaResult>>;
  __mkVisaBudget?: BudgetState;
};

const cache = globalStore.__mkVisaCache ?? new Map<string, CacheEntry>();
const pending = globalStore.__mkVisaPending ?? new Map<string, Promise<VisaResult>>();
globalStore.__mkVisaCache = cache;
globalStore.__mkVisaPending = pending;

const cacheHours = Math.max(1, Number(process.env.VISA_CACHE_TTL_HOURS || 168));
const cacheTtlMs = cacheHours * 60 * 60 * 1000;
const maxCacheEntries = 500;

export function visaCacheKey(input: VisaCheckInput) {
  return JSON.stringify({
    passport: input.passportNationality,
    destination: input.destinationCountry,
    residence: input.currentResidence,
    purpose: input.purpose,
    days: input.stayLength,
    conditions: input.conditions,
    otherResidence: input.otherResidencePermitCountry || "",
  });
}

export function getCachedVisaResult(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedVisaResult(key: string, result: VisaResult) {
  if (cache.size >= maxCacheEntries) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  const ttl = result.status === "uncertain" ? Math.min(cacheTtlMs, 12 * 60 * 60 * 1000) : cacheTtlMs;
  cache.set(key, { result, expiresAt: Date.now() + ttl });
}

export function getPendingVisaResult(key: string) {
  return pending.get(key);
}

export function setPendingVisaResult(key: string, promise: Promise<VisaResult>) {
  pending.set(key, promise);
}

export function clearPendingVisaResult(key: string) {
  pending.delete(key);
}

export function consumeDailyAiBudget() {
  const today = new Date().toISOString().slice(0, 10);
  const dailyLimit = Math.max(1, Number(process.env.DAILY_AI_LIMIT || 100));
  let state = globalStore.__mkVisaBudget;

  if (!state || state.date !== today) {
    state = { date: today, count: 0 };
    globalStore.__mkVisaBudget = state;
  }

  if (state.count >= dailyLimit) return { allowed: false, remaining: 0 };
  state.count += 1;
  return { allowed: true, remaining: dailyLimit - state.count };
}
