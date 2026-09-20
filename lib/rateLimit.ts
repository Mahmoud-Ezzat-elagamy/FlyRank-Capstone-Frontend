export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // in seconds
}

interface WindowRecord {
  timestamps: number[];
}

const ipWindows = new Map<string, WindowRecord>();

// Clean up stale entries every 5 minutes to avoid memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [ip, record] of ipWindows.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < windowMs);
    if (valid.length === 0) {
      ipWindows.delete(ip);
    } else {
      record.timestamps = valid;
    }
  }
}

/**
 * In-memory sliding window rate limiter per client IP.
 * Best-effort for serverless/edge environments without external Redis.
 *
 * @param ip Client IP address
 * @param limit Max requests allowed in the window (defaults to env or 6)
 * @param windowMs Window duration in milliseconds (default 60,000ms = 1 minute)
 */
export function checkRateLimit(
  ip: string,
  limit?: number,
  windowMs = 60_000
): RateLimitResult {
  const maxRequests = limit ?? Number(process.env.RATE_LIMIT_PER_MINUTE || "6");
  const now = Date.now();

  cleanupStaleRecords(windowMs);

  let record = ipWindows.get(ip);
  if (!record) {
    record = { timestamps: [] };
    ipWindows.set(ip, record);
  }

  // Filter timestamps outside current rolling window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    // Oldest timestamp in the active window determines retry-after
    const oldest = record.timestamps[0];
    const waitMs = windowMs - (now - oldest);
    const retryAfter = Math.max(1, Math.ceil(waitMs / 1000));

    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    retryAfter: 0,
  };
}

/**
 * Resets the in-memory rate limiter table (primarily for test isolation).
 */
export function resetRateLimits(): void {
  ipWindows.clear();
}
