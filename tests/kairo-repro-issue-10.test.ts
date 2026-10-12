import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

/**
 * Reproduction test for issue #10 – Support discount codes at checkout.
 *
 * All tests below FAIL on the current codebase because:
 *   - POST /discount-codes does not exist (returns 404)
 *   - POST /orders ignores (strips) the discountCode field, so no discount
 *     is applied and validation of unknown/expired codes never happens.
 *
 * These tests will pass once the feature is implemented.
 */

const baseOrder = {
  customerEmail: "buyer@example.com",
  items: [{ sku: "WIDGET-1", price: 100.0, quantity: 1 }],
};

describe("discount codes – registration", () => {
  it("registers a percentage discount code", async () => {
    const res = await request(createApp())
      .post("/discount-codes")
      .send({ code: "BLACKFRIDAY10", type: "percentage", value: 10 });

    expect(res.status).toBe(201);
    expect(res.body.code).toBe("BLACKFRIDAY10");
    expect(res.body.type).toBe("percentage");
    expect(res.body.value).toBe(10);
  });

  it("registers a fixed-amount discount code", async () => {
    const res = await request(createApp())
      .post("/discount-codes")
      .send({ code: "SAVE5", type: "fixed", value: 5 });

    expect(res.status).toBe(201);
    expect(res.body.code).toBe("SAVE5");
    expect(res.body.type).toBe("fixed");
    expect(res.body.value).toBe(5);
  });

  it("registers a discount code with a future expiry date", async () => {
    const res = await request(createApp())
      .post("/discount-codes")
      .send({ code: "CYBER20", type: "percentage", value: 20, expiresAt: "2030-12-31" });

    expect(res.status).toBe(201);
    expect(res.body.expiresAt).toBe("2030-12-31");
  });

  it("rejects a discount code with a missing type", async () => {
    const res = await request(createApp())
      .post("/discount-codes")
      .send({ code: "BADCODE", value: 10 });

    expect(res.status).toBe(400);
  });

  it("retrieves a registered discount code by its code", async () => {
    const app = createApp();

    await request(app)
      .post("/discount-codes")
      .send({ code: "FETCH_ME", type: "fixed", value: 15 });

    const res = await request(app).get("/discount-codes/FETCH_ME");

    expect(res.status).toBe(200);
    expect(res.body.code).toBe("FETCH_ME");
    expect(res.body.value).toBe(15);
  });

  it("returns 404 for an unregistered discount code", async () => {
    const res = await request(createApp()).get("/discount-codes/NO_SUCH_CODE");
    expect(res.status).toBe(404);
  });
});

describe("discount codes – applied at checkout", () => {
  it("applies a percentage discount code and reduces the order subtotal", async () => {
    const app = createApp();

    await request(app)
      .post("/discount-codes")
      .send({ code: "PCTOFF10", type: "percentage", value: 10 });

    // $100 order  →  10 % off  →  subtotal $90
    const res = await request(app)
      .post("/orders")
      .send({ ...baseOrder, discountCode: "PCTOFF10" });

    expect(res.status).toBe(201);
    expect(res.body.discountCode).toBe("PCTOFF10");
    expect(res.body.discountAmount).toBeCloseTo(10, 2);
    expect(res.body.subtotal).toBeCloseTo(90, 2);
  });

  it("applies a fixed-amount discount code and reduces the order subtotal", async () => {
    const app = createApp();

    await request(app)
      .post("/discount-codes")
      .send({ code: "FIXED15", type: "fixed", value: 15 });

    // $100 order  →  $15 off  →  subtotal $85
    const res = await request(app)
      .post("/orders")
      .send({ ...baseOrder, discountCode: "FIXED15" });

    expect(res.status).toBe(201);
    expect(res.body.discountCode).toBe("FIXED15");
    expect(res.body.discountAmount).toBeCloseTo(15, 2);
    expect(res.body.subtotal).toBeCloseTo(85, 2);
  });

  it("rejects checkout with an unknown discount code", async () => {
    const res = await request(createApp())
      .post("/orders")
      .send({ ...baseOrder, discountCode: "GHOST_CODE" });

    expect(res.status).toBe(400);
  });

  it("rejects checkout with an expired discount code", async () => {
    const app = createApp();

    // Register a code that expired in the past (today is 2026-10-12)
    await request(app)
      .post("/discount-codes")
      .send({ code: "XMAS2025", type: "percentage", value: 25, expiresAt: "2025-12-26" });

    const res = await request(app)
      .post("/orders")
      .send({ ...baseOrder, discountCode: "XMAS2025" });

    expect(res.status).toBe(400);
  });

  it("accepts checkout with a discount code whose expiry is in the future", async () => {
    const app = createApp();

    await request(app)
      .post("/discount-codes")
      .send({ code: "FUTURE30", type: "percentage", value: 30, expiresAt: "2030-01-01" });

    const res = await request(app)
      .post("/orders")
      .send({ ...baseOrder, discountCode: "FUTURE30" });

    expect(res.status).toBe(201);
    expect(res.body.discountAmount).toBeCloseTo(30, 2);
  });

  it("does not apply a discount when no discount code is provided", async () => {
    const res = await request(createApp()).post("/orders").send(baseOrder);

    expect(res.status).toBe(201);
    // Either the field is absent or explicitly zero – either way, no discount applied.
    const discount = res.body.discountAmount ?? 0;
    expect(discount).toBe(0);
  });
});