import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ShippingAddress } from "../src/lib/shipping";

const { mockCreate } = vi.hoisted(() => {
  const mockCreate = vi.fn();
  return { mockCreate };
});

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));

import { getShippingRates } from "../src/lib/shipping";

const origin: ShippingAddress = {
  street: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001",
  country: "US",
};

const destination: ShippingAddress = {
  street: "456 Oak Ave",
  city: "Los Angeles",
  state: "CA",
  zip: "90001",
  country: "US",
};

describe("getShippingRates", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it("returns parsed shipping rates from a text response", async () => {
    const fakeRates = [
      { carrier: "UPS", service: "Ground", rate: 12.5, currency: "USD", estimatedDays: 5 },
      { carrier: "FedEx", service: "Express", rate: 24.99, currency: "USD", estimatedDays: 2 },
    ];
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: JSON.stringify(fakeRates) }],
    });

    const rates = await getShippingRates(origin, destination, 2.5);
    expect(rates).toHaveLength(2);
    expect(rates[0]).toEqual(fakeRates[0]);
    expect(rates[1]).toEqual(fakeRates[1]);
  });

  it("throws when the response content block is not text", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "image" }],
    });

    await expect(getShippingRates(origin, destination, 1)).rejects.toThrow(
      "Unexpected response type from API"
    );
  });
});