import { describe, expect, it } from "vitest";
import { TtlCache } from "../src/lib/cache";

describe("TtlCache issue #8 - set with ttl=0 should not cache", () => {
  it("does not cache the value when ttlMs is 0", () => {
    const cache = new TtlCache<string>();
    cache.set("k", "v", 0);
    expect(cache.get("k")).toBeUndefined();
  });
});