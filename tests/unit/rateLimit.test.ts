import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests up to the specified limit", () => {
    const ip = "192.168.1.10";
    const limit = 3;

    const res1 = checkRateLimit(ip, limit);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(ip, limit);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(ip, limit);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests exceeding the specified limit and provides retryAfter", () => {
    const ip = "192.168.1.20";
    const limit = 2;

    checkRateLimit(ip, limit);
    checkRateLimit(ip, limit);

    const blocked = checkRateLimit(ip, limit);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("tracks rate limits independently for different IP addresses", () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";
    const limit = 1;

    expect(checkRateLimit(ipA, limit).allowed).toBe(true);
    expect(checkRateLimit(ipA, limit).allowed).toBe(false);

    // IP B should still be allowed
    expect(checkRateLimit(ipB, limit).allowed).toBe(true);
  });
});
