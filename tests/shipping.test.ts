import { describe, expect, it } from "vitest";
import { cheapestRate, quoteRates } from "../src/lib/shipping";

describe("quoteRates", () => {
  it("returns a rate for each carrier", () => {
    const rates = quoteRates(10);
    expect(rates).toHaveLength(3);
    const carriers = rates.map((r) => r.carrier);
    expect(carriers).toContain("ups");
    expect(carriers).toContain("fedex");
    expect(carriers).toContain("usps");
  });

  it("includes service name, days and rateUsd on each entry", () => {
    const rates = quoteRates(2);
    for (const r of rates) {
      expect(r.service).toBeTruthy();
      expect(r.days).toBeGreaterThan(0);
      expect(r.rateUsd).toBeGreaterThan(0);
    }
  });

  it("calculates rateUsd as base + weight * 0.5", () => {
    const rates = quoteRates(4);
    const usps = rates.find((r) => r.carrier === "usps")!;
    // base 5.2 + 4 * 0.5 = 7.2
    expect(usps.rateUsd).toBeCloseTo(7.2);
    const fedex = rates.find((r) => r.carrier === "fedex")!;
    // base 7.9 + 4 * 0.5 = 9.9
    expect(fedex.rateUsd).toBeCloseTo(9.9);
    const ups = rates.find((r) => r.carrier === "ups")!;
    // base 8.5 + 4 * 0.5 = 10.5
    expect(ups.rateUsd).toBeCloseTo(10.5);
  });

  it("throws a RangeError for non-positive weight", () => {
    expect(() => quoteRates(0)).toThrow(RangeError);
    expect(() => quoteRates(-1)).toThrow(RangeError);
  });
});

describe("cheapestRate", () => {
  it("returns the carrier with the lowest rateUsd", () => {
    const best = cheapestRate(2);
    // usps base 5.2 is always cheapest
    expect(best.carrier).toBe("usps");
  });

  it("returns a valid ShippingRate object", () => {
    const best = cheapestRate(5);
    expect(best.service).toBeTruthy();
    expect(best.days).toBeGreaterThan(0);
    expect(best.rateUsd).toBeGreaterThan(0);
  });
});