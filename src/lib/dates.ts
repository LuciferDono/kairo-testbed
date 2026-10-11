import { addDays, format, parseISO } from "date-fns";

/** Estimated delivery date (yyyy-MM-dd) for an order placed at `orderedAtIso`. */
export function deliveryEstimate(orderedAtIso: string, shippingDays: number): string {
  const estimate = addDays(parseISO(orderedAtIso), shippingDays);
  return format(estimate, "yyyy-MM-dd");
}
