import { expect, it } from "vitest";
import { answer } from "../src/lib/answer";

it("answers 42", () => {
  expect(answer()).toBe(41);
});
