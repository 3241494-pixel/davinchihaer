import { describe, expect, it } from "vitest";
import type { ContentSource } from "./source/content-source";
import { createContentApi, getPriceRange } from "./products";
import type { HairColor, Product, ProductVariant } from "./types";

function color(
  code: string,
  group: HairColor["group"],
  hex = "#000000",
): HairColor {
  return {
    code,
    name: { ru: code, en: code, ka: code },
    hex,
    group,
  };
}

function variant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    id: overrides.id ?? "variant-1",
    length: 40,
    weight: 100,
    tapesCount: 20,
    color: "6",
    price: 10000,
    inStock: true,
    sku: "SKU-1",
    ...overrides,
  };
}

function product(overrides: Partial<Product> = {}): Product {
  return {
    slug: "product-1",
    category: "tape-classic",
    title: { ru: "Товар", en: "Product", ka: "Product" },
    shortDescription: { ru: "", en: "", ka: "" },
    description: { ru: "", en: "", ka: "" },
    variants: [variant()],
    images: [{ src: "/img.jpg", alt: { ru: "", en: "", ka: "" } }],
    seo: {
      title: { ru: "", en: "", ka: "" },
      description: { ru: "", en: "", ka: "" },
    },
    ...overrides,
  };
}

const colors: HairColor[] = [
  color("6", "brown"),
  color("18", "blonde"),
  color("99j", "red"),
];

const fixtureProducts: Product[] = [
  product({
    slug: "classic-cheap",
    category: "tape-classic",
    tapeWidth: 4,
    variants: [
      variant({ id: "cc-40", length: 40, color: "6", price: 5000, inStock: true }),
      variant({ id: "cc-60", length: 60, color: "18", price: 8000, inStock: false }),
    ],
  }),
  product({
    slug: "classic-expensive",
    category: "tape-classic",
    tapeWidth: 3,
    variants: [
      variant({ id: "ce-50", length: 50, color: "18", price: 15000, inStock: true }),
      variant({ id: "ce-70", length: 70, color: "99j", price: 20000, inStock: true }),
    ],
  }),
  product({
    slug: "imitation-1",
    category: "tape-imitation-1",
    variants: [
      variant({ id: "i1-40", length: 40, color: "6", price: 12000, inStock: false }),
    ],
  }),
  product({
    slug: "accessory",
    category: "accessories",
    variants: [
      variant({ id: "acc-40", length: 40, color: "6", price: 3000, inStock: true }),
    ],
  }),
];

function fakeSource(
  products: Product[] = fixtureProducts,
  colorList: HairColor[] = colors,
): ContentSource {
  return {
    getProductsRaw: () => products as unknown[],
    getColorsRaw: () => colorList as unknown[],
  };
}

describe("getPriceRange", () => {
  it("returns min and max across variants", () => {
    const p = product({
      variants: [
        variant({ id: "a", price: 5000 }),
        variant({ id: "b", price: 9000 }),
        variant({ id: "c", price: 7000 }),
      ],
    });
    expect(getPriceRange(p)).toEqual({ min: 5000, max: 9000 });
  });

  it("returns the same value twice for a single variant", () => {
    const p = product({ variants: [variant({ id: "only", price: 4200 })] });
    expect(getPriceRange(p)).toEqual({ min: 4200, max: 4200 });
  });
});

describe("filterProducts", () => {
  it("returns all products when called without filters", () => {
    const api = createContentApi(fakeSource());
    expect(api.filterProducts()).toHaveLength(fixtureProducts.length);
  });

  it("filters by category", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ category: "tape-classic" });
    expect(result.map((p) => p.slug)).toEqual([
      "classic-cheap",
      "classic-expensive",
    ]);
  });

  it("filters by tapeWidth", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ tapeWidth: 3 });
    expect(result.map((p) => p.slug)).toEqual(["classic-expensive"]);
  });

  it("filters by length, matching a product if any variant matches", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ lengths: [70] });
    expect(result.map((p) => p.slug)).toEqual(["classic-expensive"]);
  });

  it("filters by colorCodes", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ colorCodes: ["99j"] });
    expect(result.map((p) => p.slug)).toEqual(["classic-expensive"]);
  });

  it("filters by colorGroups, resolving codes via getColors()", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ colorGroups: ["blonde"] });
    expect(result.map((p) => p.slug).sort()).toEqual([
      "classic-cheap",
      "classic-expensive",
    ]);
  });

  it("filters by inStockOnly, keeping products with at least one in-stock variant", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ inStockOnly: true });
    expect(result.map((p) => p.slug).sort()).toEqual([
      "accessory",
      "classic-cheap",
      "classic-expensive",
    ]);
  });

  it("filters by priceMin/priceMax range", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ priceMin: 9000, priceMax: 16000 });
    expect(result.map((p) => p.slug).sort()).toEqual([
      "classic-expensive",
      "imitation-1",
    ]);
  });

  it("combines multiple filters", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({
      category: "tape-classic",
      inStockOnly: true,
      priceMax: 6000,
    });
    expect(result.map((p) => p.slug)).toEqual(["classic-cheap"]);
  });

  it("returns an empty array when nothing matches", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ category: "care" });
    expect(result).toEqual([]);
  });

  it("returns an empty array for an impossible price range", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ priceMin: 999999 });
    expect(result).toEqual([]);
  });

  it("sorts by price-asc using each product's minimum price", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ sort: "price-asc" });
    expect(result.map((p) => p.slug)).toEqual([
      "accessory",
      "classic-cheap",
      "imitation-1",
      "classic-expensive",
    ]);
  });

  it("sorts by price-desc using each product's minimum price", () => {
    const api = createContentApi(fakeSource());
    const result = api.filterProducts({ sort: "price-desc" });
    expect(result.map((p) => p.slug)).toEqual([
      "classic-expensive",
      "imitation-1",
      "classic-cheap",
      "accessory",
    ]);
  });

  it("defaults to popularity sort, keeping original order when nothing is tagged", () => {
    const api = createContentApi(fakeSource());
    expect(api.filterProducts().map((p) => p.slug)).toEqual(
      fixtureProducts.map((p) => p.slug),
    );
    expect(api.filterProducts({ sort: "popularity" }).map((p) => p.slug)).toEqual(
      fixtureProducts.map((p) => p.slug),
    );
  });

  it("sorts by popularity, moving bestseller-tagged products first", () => {
    const tagged = fixtureProducts.map((p) =>
      p.slug === "imitation-1" ? { ...p, badges: ["bestseller" as const] } : p,
    );
    const api = createContentApi(fakeSource(tagged));
    const result = api.filterProducts({ sort: "popularity" });
    expect(result.map((p) => p.slug)).toEqual([
      "imitation-1",
      "classic-cheap",
      "classic-expensive",
      "accessory",
    ]);
  });

  it("sorts by newest, moving new-tagged products first", () => {
    const tagged = fixtureProducts.map((p) =>
      p.slug === "accessory" ? { ...p, badges: ["new" as const] } : p,
    );
    const api = createContentApi(fakeSource(tagged));
    const result = api.filterProducts({ sort: "newest" });
    expect(result.map((p) => p.slug)).toEqual([
      "accessory",
      "classic-cheap",
      "classic-expensive",
      "imitation-1",
    ]);
  });
});

describe("createContentApi lookups", () => {
  it("getProductBySlug finds an existing product and returns undefined otherwise", () => {
    const api = createContentApi(fakeSource());
    expect(api.getProductBySlug("classic-cheap")?.slug).toBe("classic-cheap");
    expect(api.getProductBySlug("does-not-exist")).toBeUndefined();
  });

  it("getProductsByCategory returns only matching products", () => {
    const api = createContentApi(fakeSource());
    expect(
      api.getProductsByCategory("accessories").map((p) => p.slug),
    ).toEqual(["accessory"]);
  });

  it("getColorByCode finds an existing color and returns undefined otherwise", () => {
    const api = createContentApi(fakeSource());
    expect(api.getColorByCode("18")?.group).toBe("blonde");
    expect(api.getColorByCode("nope")).toBeUndefined();
  });

  it("getCategories returns the fixed domain list regardless of loaded data", () => {
    const api = createContentApi(fakeSource());
    expect(api.getCategories()).toEqual([
      "tape-classic",
      "tape-imitation-1",
      "tape-imitation-2",
      "accessories",
      "care",
    ]);
  });

  it("throws when a product fails schema validation", () => {
    const api = createContentApi(
      fakeSource([{ slug: "broken" } as unknown as Product]),
    );
    expect(() => api.getAllProducts()).toThrow(/broken/);
  });
});
