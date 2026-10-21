import { describe, expect, it } from "vitest";
import { isPlaceholderSku } from "./sku";

describe("isPlaceholderSku", () => {
  it("treats demo and TODO_CLIENT article numbers as placeholders", () => {
    expect(isPlaceholderSku("DEMO-BIO-TAPE-SLAVIC-STRAIGHT-40-90-50")).toBe(
      true,
    );
    expect(isPlaceholderSku("TODO_CLIENT-PRIMER")).toBe(true);
  });

  it("keeps real article numbers", () => {
    expect(isPlaceholderSku("DVH-BT-SL-50-100")).toBe(false);
  });
});
