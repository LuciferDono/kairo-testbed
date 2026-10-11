import { describe, expect, it } from "vitest";
import { deliveryEstimate } from "../src/lib/dates";

describe("deliveryEstimate", () => {
  it("adds the shipping days", () => {
    expect(deliveryEstimate("2026-03-01T12:00:00Z", 3)).toBe("2026-03-04");
  });
});
