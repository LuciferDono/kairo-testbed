import { z } from "zod";

export const createOrderSchema = z.object({
  customerEmail: z.string().email(),
  items: z
    .array(
      z.object({
        sku: z.string().min(1),
        price: z.number().positive(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  notes: z.record(z.string(), z.string()).optional(),
  shippingDays: z.number().int().min(1).max(14).default(3),
});

export function formatErrors(error: z.ZodError) {
  return error.issues.map((e) => ({ path: e.path.join("."), message: e.message }));
}