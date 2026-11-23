/**
 * Simple in-memory sliding window rate limiter for Next.js API Routes.
 * Automatically evicts stale entries to prevent memory leaks in production.
 */

const ipStore = new Map();

// Passive / lazy eviction without background setInterval (100% serverless compatible)
function pruneExpiredEntries(now) {
  if (ipStore.size > 1000) {
    for (const [key, record] of ipStore.entries()) {
      if (record.resetTime < now) {
        ipStore.delete(key);
      }
    }
  }
}

export function getClientIp(request) {
  if (!request) return "127.0.0.1";
  const forwarded = request.headers?.get?.("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    request.headers?.get?.("x-real-ip") ||
    request.headers?.get?.("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/**
 * Check if a request exceeds the specified limit within a window.
 * @param {string} key Identifier (e.g. `login:${ip}`)
 * @param {number} limit Maximum allowed requests in the time window
 * @param {number} windowMs Time window in milliseconds
 * @returns {{ success: boolean, remaining: number, reset: number }}
 */
export function rateLimit(key, limit = 10, windowMs = 60 * 1000) {
  const now = Date.now();
  pruneExpiredEntries(now);
  const existing = ipStore.get(key);

  if (!existing || existing.resetTime < now) {
    ipStore.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, reset: existing.resetTime };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    reset: existing.resetTime,
  };
}
