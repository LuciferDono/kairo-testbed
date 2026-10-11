import { afterEach, describe, expect, it, vi } from "vitest";
import { usdTo } from "../src/lib/exchange";

describe("usdTo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a positive rate for EUR", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ rate: 0.92 }),
      }),
    );
    const rate = await usdTo("EUR");
    expect(rate).toBeGreaterThan(0);
  });
});