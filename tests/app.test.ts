import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

const validOrder = {
  customerEmail: "ana@example.com",
  items: [{ sku: "MUG-1", price: 12.5, quantity: 2 }],
};

describe("orders api", () => {
  it("reports health", async () => {
    const res = await request(createApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("creates an order", async () => {
    const res = await request(createApp()).post("/orders").send(validOrder);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.status).toBe("pending");
  });

  it("rejects an invalid order with field errors", async () => {
    const res = await request(createApp())
      .post("/orders")
      .send({ ...validOrder, customerEmail: "not-an-email" });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].path).toBe("customerEmail");
  });

  it("accepts string notes on an order", async () => {
    const res = await request(createApp())
      .post("/orders")
      .send({ ...validOrder, notes: { gift: "yes" } });
    expect(res.status).toBe(201);
  });

  it("fetches an order by id", async () => {
    const app = createApp();
    const created = await request(app).post("/orders").send(validOrder);
    const res = await request(app).get(`/orders/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it("returns 404 for an unknown order", async () => {
    const res = await request(createApp()).get("/orders/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns 404 for an unknown route", async () => {
    const res = await request(createApp()).get("/nope");
    expect(res.status).toBe(404);
  });

  it("ships an order", async () => {
    const app = createApp();
    const created = await request(app).post("/orders").send(validOrder);
    const res = await request(app).post(`/orders/${created.body.id}/ship`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("shipped");
  });

  it("lists orders", async () => {
    const res = await request(createApp()).get("/orders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("registers a valid product slug", async () => {
    const res = await request(createApp()).post("/products").send({ slug: "blue-mug" });
    expect(res.status).toBe(201);
  });

  it("rejects an invalid product slug", async () => {
    const res = await request(createApp()).post("/products").send({ slug: "Blue Mug!" });
    expect(res.status).toBe(400);
  });

  it("serves an uploaded file", async () => {
    const res = await request(createApp()).get("/files/hello.txt");
    expect(res.status).toBe(200);
    expect(res.text).toContain("hello from the uploads folder");
  });

  it("returns 404 for a missing file", async () => {
    const res = await request(createApp()).get("/files/missing.txt");
    expect(res.status).toBe(404);
  });

  it("limits request volume", async () => {
    const app = createApp();
    let last = 200;
    for (let i = 0; i < 101; i += 1) {
      last = (await request(app).get("/health")).status;
    }
    expect(last).toBe(429);
  });
});
