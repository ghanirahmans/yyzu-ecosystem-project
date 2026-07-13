// ============================================================
// YYZU Rate Limiter — in-memory sliding window (industry best)
//
// Lightweight: no Redis dependency. Suitable for single-
// instance deployments on Vercel / Railway / Fly.io.
// For multi-instance, swap to Upstash Redis.
// ============================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Sliding-window rate limiter.
 *
 * @param key       Unique identifier (IP, user ID, etc.)
 * @param maxReqs   Maximum requests allowed in the window
 * @param windowMs  Window duration in milliseconds
 * @returns         { allowed: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  key: string,
  maxReqs: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — start fresh
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxReqs - 1, resetAt };
  }

  if (entry.count >= maxReqs) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxReqs - entry.count, resetAt: entry.resetAt };
}

// ── Preset policies ──────────────────────────────────────────

/** General API: 60 requests per minute per IP */
export function apiRateLimit(ip: string) {
  return rateLimit(`api:${ip}`, 60, 60_000);
}

/** Auth actions: 10 requests per minute per IP */
export function authRateLimit(ip: string) {
  return rateLimit(`auth:${ip}`, 10, 60_000);
}

/** Login: 5 attempts per minute per IP */
export function loginRateLimit(ip: string) {
  return rateLimit(`login:${ip}`, 5, 60_000);
}

/** Cron / health ping: 30 requests per minute per IP */
export function pingRateLimit(ip: string) {
  return rateLimit(`ping:${ip}`, 30, 60_000);
}