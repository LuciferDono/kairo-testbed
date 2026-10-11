import { describe, expect, it } from "vitest";
import { formatMoney, orderTotal } from "../src/lib/money";

describe("money", () => {
  it("totals an order with tax", () => {
    const result = orderTotal([{ price: 10, quantity: 2 }], 0.1);
    expect(result.subtotal).toBeCloseTo(20);
    expect(result.tax).toBeCloseTo(2);
    expect(result.total).toBeCloseTo(22);
  });

  it("formats an amount", () => {
    expect(formatMoney(5)).toBe("$5.00");
  });
});
