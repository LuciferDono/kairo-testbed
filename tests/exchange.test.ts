import { describe, expect, it } from "vitest";
import { usdTo } from "../src/lib/exchange";

describe("usdTo", () => {
  it("returns a positive rate for EUR", async () => {
    const rate = await usdTo("EUR");
    expect(rate).toBeGreaterThan(0);
  });
});
