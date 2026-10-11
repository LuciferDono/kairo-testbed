import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TtlCache } from "../src/lib/cache";

describe("TtlCache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns a stored value", () => {
    const cache = new TtlCache<string>();
    cache.set("a", "1");
    expect(cache.get("a")).toBe("1");
  });

  it("expires a value after its ttl", () => {
    const cache = new TtlCache<string>();
    cache.set("a", "1", 100);
    vi.advanceTimersByTime(101);
    expect(cache.get("a")).toBeUndefined();
  });
});
