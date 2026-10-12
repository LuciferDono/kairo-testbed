import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

const validOrder = {
  customerEmail: "test@example.com",
  items: [{ sku: "SKU-1", price: 10.0, quantity: 1 }],
};

describe("issue #2 – pagination off-by-one: last item on every page is missing", () => {
  it("GET /orders?limit=1 returns exactly 1 item when at least 1 order exists", async () => {
    const app = createApp();

    // Create one order
    const created = await request(app).post("/orders").send(validOrder);
    expect(created.status).toBe(201);

    // With limit=1 we must get that one order back, not an empty page
    const res = await request(app).get("/orders?limit=1&page=1");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].id).toBe(created.body.id);
  });

  it("GET /orders?limit=2 returns 2 items when 2 orders exist", async () => {
    const app = createApp();

    // Create two orders
    const first = await request(app).post("/orders").send(validOrder);
    const second = await request(app).post("/orders").send({
      ...validOrder,
      customerEmail: "second@example.com",
    });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);

    const res = await request(app).get("/orders?limit=2&page=1");
    expect(res.status).toBe(200);
    // With 2 orders and limit=2 the page must contain both orders, not just 1
    expect(res.body.items).toHaveLength(2);
  });

  it("GET /orders?limit=1&page=2 returns the second order when 2 orders exist", async () => {
    const app = createApp();

    await request(app).post("/orders").send(validOrder);
    const second = await request(app).post("/orders").send({
      ...validOrder,
      customerEmail: "second@example.com",
    });
    expect(second.status).toBe(201);

    const res = await request(app).get("/orders?limit=1&page=2");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].id).toBe(second.body.id);
  });
});