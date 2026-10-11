import { describe, expect, it } from "vitest";
import { isValidSlug, slugify } from "../src/lib/slug";

describe("slug", () => {
  it("accepts a normal slug", () => {
    expect(isValidSlug("blue-mug-2")).toBe(true);
  });

  it("rejects spaces and capitals", () => {
    expect(isValidSlug("Blue Mug")).toBe(false);
  });

  it("slugifies a title", () => {
    expect(slugify("  Blue Mug (2-pack)! ")).toBe("blue-mug-2-pack");
  });
});
