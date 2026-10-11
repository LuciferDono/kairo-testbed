export interface ShippingRate {
  carrier: string;
  service: string;
  days: number;
  rateUsd: number;
}

const CARRIERS: Array<{ carrier: string; service: string; days: number; base: number }> = [
  { carrier: "usps", service: "USPS Priority Mail", days: 3, base: 5.2 },
  { carrier: "fedex", service: "FedEx Ground", days: 2, base: 7.9 },
  { carrier: "ups", service: "UPS Ground", days: 2, base: 8.5 },
];

export function quoteRates(weightLb: number): ShippingRate[] {
  if (weightLb <= 0) {
    throw new RangeError("weightLb must be greater than 0");
  }
  return CARRIERS.map(({ carrier, service, days, base }) => ({
    carrier,
    service,
    days,
    rateUsd: base + weightLb * 0.5,
  }));
}

export function cheapestRate(weightLb: number): ShippingRate {
  const rates = quoteRates(weightLb);
  return rates.reduce((best, current) => (current.rateUsd < best.rateUsd ? current : best));
}