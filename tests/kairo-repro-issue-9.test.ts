import { describe, expect, it } from "vitest";
import { paginate } from "../src/lib/pagination";

/**
 * Regression test for issue #9 – "The orders page is slow sometimes".
 *
 * Root cause: paginate() calls all.slice(start, end) where
 *   end = start + safeLimit - 1
 * Because Array.slice's second argument is *exclusive*, this returns
 * (safeLimit - 1) items instead of safeLimit items.  Callers therefore
 * need ceil(n / (limit-1)) page requests instead of ceil(n / limit) to
 * iterate over all orders, which is the source of the perceived slowness.
 */
describe("paginate – correct page size (issue #9)", () => {
  it("returns exactly `limit` items when the data set is large enough", () => {
    const data = Array.from({ length: 100 }, (_, i) => i);

    const result = paginate(data, 1, 20);

    // Current buggy code returns 19 items (slice excludes end index).
    // After the fix it must return 20.
    expect(result.items.length).toBe(20);
  });

  it("returns exactly `limit` items on an interior page", () => {
    const data = Array.from({ length: 100 }, (_, i) => i);

    const result = paginate(data, 2, 10);

    expect(result.items.length).toBe(10);
  });

  it("returns the correct items (not shifted by one) on page 1", () => {
    const data = Array.from({ length: 50 }, (_, i) => i);

    const result = paginate(data, 1, 5);

    // Items 0–4 expected; buggy code yields 0–3 (4 items).
    expect(result.items).toEqual([0, 1, 2, 3, 4]);
  });

  it("returns the correct items on page 2", () => {
    const data = Array.from({ length: 50 }, (_, i) => i);

    const result = paginate(data, 2, 5);

    // Items 5–9 expected; buggy code yields 5–8 (4 items).
    expect(result.items).toEqual([5, 6, 7, 8, 9]);
  });

  it("totalPages is consistent with the actual number of pages needed", () => {
    const data = Array.from({ length: 40 }, (_, i) => i);
    const limit = 10;

    const result = paginate(data, 1, limit);

    // With 40 items and limit 10, exactly 4 pages are needed.
    // Because each page is short by one item, iterating all pages misses data.
    expect(result.totalPages).toBe(Math.ceil(data.length / limit)); // 4
    expect(result.items.length).toBe(limit); // 10 – fails today (returns 9)
  });
});