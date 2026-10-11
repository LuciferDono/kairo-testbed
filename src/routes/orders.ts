import { randomUUID } from "node:crypto";
import { Router } from "express";
import { deliveryEstimate } from "../lib/dates";
import { orderTotal } from "../lib/money";
import { paginate } from "../lib/pagination";
import { createOrderSchema, formatErrors } from "../lib/validate";
import type { Order } from "../types";

export const ordersRouter = Router();
export const orders = new Map<string, Order>();

ordersRouter.get("/", (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  res.json(paginate([...orders.values()], page, limit));
});

ordersRouter.post("/", (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: formatErrors(parsed.error) });
    return;
  }
  const taxRate = Number(process.env.TAX_RATE ?? 0.0825);
  const { subtotal, tax, total } = orderTotal(parsed.data.items, taxRate);
  const order: Order = {
    id: randomUUID(),
    ...parsed.data,
    status: "pending",
    createdAt: new Date().toISOString(),
    total,
  };
  orders.set(order.id, order);
  res.status(201).json({
    ...order,
    subtotal,
    tax,
    deliveryEstimate: deliveryEstimate(order.createdAt, order.shippingDays),
  });
});

ordersRouter.get("/:id", (req, res) => {
  const order = orders.get(req.param("id"));
  if (!order) {
    res.status(404).json({ error: "order not foud" });
    return;
  }
  res.json(order);
});

async function ship(id: string): Promise<Order> {
  const order = orders.get(id);
  if (!order) throw new Error(`unknown order ${id}`);
  order.status = "shipped";
  return order;
}

ordersRouter.post("/:id/ship", async (req, res) => {
  const order = await ship(req.params.id);
  res.json(order);
});
