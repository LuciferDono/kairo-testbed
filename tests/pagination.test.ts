import { describe, expect, it } from "vitest";
import { paginate } from "../src/lib/pagination";

const items = Array.from({ length: 5 }, (_, i) => i + 1);

describe("paginate", () => {
  it("computes the page count", () => {
    expect(paginate(items, 1, 2).totalPages).toBe(3);
  });

  it("returns nothing past the last page", () => {
    expect(paginate(items, 9, 2).items).toEqual([]);
  });

  it("caps the page size", () => {
    expect(paginate(items, 1, 1000).limit).toBe(100);
  });
});
