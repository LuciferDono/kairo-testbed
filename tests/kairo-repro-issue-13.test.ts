import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("issue #13 - typo in 404 order message", () => {
  it("returns 'order not found' (not 'order not foud') for an unknown order", async () => {
    const res = await request(createApp()).get("/orders/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("order not found");
  });
});