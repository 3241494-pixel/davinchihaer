import { readFileSync, readdirSync } from "fs";
import path from "path";
import type { ContentSource } from "./content-source";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PRODUCT_DIRS = ["hair", "materials"] as const;

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export class FileContentSource implements ContentSource {
  /** content/products/hair/*.json и content/products/materials/*.json. */
  getProductsRaw(): unknown[] {
    return PRODUCT_DIRS.flatMap((sub) => {
      const dir = path.join(CONTENT_ROOT, "products", sub);
      return readdirSync(dir)
        .filter((file) => file.endsWith(".json"))
        .sort()
        .map((file) => readJson(path.join(dir, file)));
    });
  }

  getColorsRaw(): unknown[] {
    const parsed = readJson(path.join(CONTENT_ROOT, "colors.json"));
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("colors" in parsed) ||
      !Array.isArray((parsed as { colors: unknown }).colors)
    ) {
      throw new Error("content/colors.json: ожидался объект с полем colors[]");
    }
    return (parsed as { colors: unknown[] }).colors;
  }
}

export const fileContentSource = new FileContentSource();
