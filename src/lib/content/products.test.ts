import { describe, expect, it } from "vitest";
import type { ContentSource } from "./source/content-source";
import { createContentApi, getPriceRange } from "./products";
import { fileContentSource } from "./source/file-source";
import type {
  HairColor,
  HairProduct,
  HairVariant,
  MaterialProduct,
  Product,
} from "./types";

const i18n = (value: string) => ({ ru: value, en: value, ka: value });

function color(code: string, group: HairColor["group"]): HairColor {
  return { code, name: i18n(code), hex: "#000000", group };
}

function variant(overrides: Partial<HairVariant> = {}): HairVariant {
  return {
    id: "variant-1",
    length: 40,
    weightGrams: 100,
    color: "4.0",
    price: 10000,
    inStock: true,
    sku: "SKU-1",
    ...overrides,
  };
}

function hair(overrides: Partial<HairProduct> = {}): HairProduct {
  return {
    kind: "hair",
    slug: "hair-1",
    title: i18n("Hair"),
    shortDescription: i18n(""),
    description: i18n(""),
    attachment: "tape-classic",
    origin: "slavic",
    structure: "straight",
    variants: [variant()],
    images: [{ src: "/img.webp", alt: i18n("") }],
    seo: { title: i18n(""), description: i18n("") },
    ...overrides,
  };
}

function material(overrides: Partial<MaterialProduct> = {}): MaterialProduct {
  return {
    kind: "material",
    slug: "material-1",
    title: i18n("Material"),
    shortDescription: i18n(""),
    description: i18n(""),
    materialType: "tape",
    compatibleWith: [],
    spec: {},
    variants: [{ id: "m-1", inStock: true, sku: "M-1" }],
    images: [{ src: "/img.webp", alt: i18n("") }],
    seo: { title: i18n(""), description: i18n("") },
    ...overrides,
  };
}

const colors: HairColor[] = [
  color("4.0", "brown"),
  color("10.0", "blonde"),
  color("12.0", "ash"),
];

const fixtureProducts: Product[] = [
  hair({
    slug: "classic-slavic",
    attachment: "tape-classic",
    origin: "slavic",
    structure: "straight",
    variants: [
      variant({ id: "cs-40", length: 40, weightGrams: 50, color: "4.0", price: 5000, inStock: true }),
      variant({ id: "cs-60", length: 60, weightGrams: 100, color: "10.0", price: 8000, inStock: false }),
    ],
  }),
  hair({
    slug: "classic-india",
    attachment: "tape-classic",
    origin: "india",
    structure: "wavy",
    variants: [
      variant({ id: "ci-50", length: 50, weightGrams: 100, color: "10.0", price: 15000 }),
      variant({ id: "ci-70", length: 70, weightGrams: 150, color: "12.0", price: 20000 }),
    ],
  }),
  hair({
    slug: "bio-vietnam",
    attachment: "bio-tape",
    origin: "vietnam",
    structure: "porous",
    variants: [variant({ id: "bv-40", length: 40, weightGrams: 50, color: "4.0", price: 12000 })],
  }),
  hair({
    slug: "ring-no-price",
    attachment: "ring-star",
    origin: "china",
    variants: [variant({ id: "rn-40", length: 40, weightGrams: 100, color: "12.0", price: undefined })],
  }),
  material({ slug: "tape-red", compatibleWith: ["tape-classic", "imitation-1", "imitation-2"] }),
  material({ slug: "tape-yellow", compatibleWith: ["bio-tape"] }),
  material({ slug: "primer", materialType: "primer", compatibleWith: [] }),
];

function fakeSource(products: unknown[] = fixtureProducts): ContentSource {
  return {
    getProductsRaw: () => products,
    getColorsRaw: () => colors,
  };
}

const slugs = (products: Product[]) => products.map((p) => p.slug);

describe("getPriceRange", () => {
  it("returns min and max over priced variants", () => {
    expect(getPriceRange(fixtureProducts[1])).toEqual({ min: 15000, max: 20000 });
  });

  it("returns null when no variant has a price", () => {
    expect(getPriceRange(fixtureProducts[3])).toBeNull();
  });
});

describe("split by kind", () => {
  it("separates hair and materials", () => {
    const api = createContentApi(fakeSource());
    expect(slugs(api.getHairProducts())).toEqual([
      "classic-slavic",
      "classic-india",
      "bio-vietnam",
      "ring-no-price",
    ]);
    expect(slugs(api.getMaterials())).toEqual(["tape-red", "tape-yellow", "primer"]);
  });
});

describe("filterHair", () => {
  const api = createContentApi(fakeSource());

  it("defaults to price ascending with unpriced products last", () => {
    expect(slugs(api.filterHair())).toEqual([
      "classic-slavic",
      "bio-vietnam",
      "classic-india",
      "ring-no-price",
    ]);
  });

  it("keeps unpriced products last when sorting by price descending", () => {
    expect(slugs(api.filterHair({ sort: "price-desc" }))).toEqual([
      "classic-india",
      "bio-vietnam",
      "classic-slavic",
      "ring-no-price",
    ]);
  });

  it("filters by attachment, origin and structure", () => {
    expect(slugs(api.filterHair({ attachment: ["tape-classic"] }))).toEqual([
      "classic-slavic",
      "classic-india",
    ]);
    expect(slugs(api.filterHair({ attachment: ["tape-classic"], origin: ["india"] }))).toEqual([
      "classic-india",
    ]);
    expect(slugs(api.filterHair({ structure: ["porous", "wavy"] }))).toEqual([
      "bio-vietnam",
      "classic-india",
    ]);
  });

  it("filters by density range on variants", () => {
    expect(slugs(api.filterHair({ weightMin: 120 }))).toEqual(["classic-india"]);
    expect(slugs(api.filterHair({ weightMax: 50 }))).toEqual(["classic-slavic", "bio-vietnam"]);
    expect(slugs(api.filterHair({ weightMin: 100, weightMax: 100 }))).toEqual([
      "classic-slavic",
      "classic-india",
      "ring-no-price",
    ]);
  });

  it("requires variant-level conditions to hold on the same variant", () => {
    // У classic-slavic 60 см есть, но не в наличии.
    expect(slugs(api.filterHair({ lengths: [60], inStockOnly: true }))).toEqual([]);
    expect(slugs(api.filterHair({ lengths: [60] }))).toEqual(["classic-slavic"]);
  });

  it("filters by colour code and colour group", () => {
    expect(slugs(api.filterHair({ colorCodes: ["12.0"] }))).toEqual([
      "classic-india",
      "ring-no-price",
    ]);
    expect(slugs(api.filterHair({ colorGroups: ["brown"] }))).toEqual([
      "classic-slavic",
      "bio-vietnam",
    ]);
  });

  it("excludes unpriced products when a price filter is set", () => {
    expect(slugs(api.filterHair({ priceMin: 10000 }))).toEqual(["bio-vietnam", "classic-india"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(api.filterHair({ attachment: ["imitation-2"] })).toEqual([]);
    expect(api.filterHair({ origin: ["china"], structure: ["curly"] })).toEqual([]);
  });
});

describe("compatibility", () => {
  const api = createContentApi(fakeSource());

  it("getMaterialsFor returns compatible plus universal materials", () => {
    expect(slugs(api.getMaterialsFor("tape-classic"))).toEqual(["tape-red", "primer"]);
    expect(slugs(api.getMaterialsFor("bio-tape"))).toEqual(["tape-yellow", "primer"]);
  });

  it("Ring Star needs no tape: only universal materials", () => {
    expect(slugs(api.getMaterialsFor("ring-star"))).toEqual(["primer"]);
  });

  it("getHairFor links a material back to suitable hair", () => {
    const yellow = api.getMaterials().find((m) => m.slug === "tape-yellow")!;
    expect(slugs(api.getHairFor(yellow))).toEqual(["bio-vietnam"]);
    const primer = api.getMaterials().find((m) => m.slug === "primer")!;
    expect(api.getHairFor(primer)).toHaveLength(4);
  });
});

describe("facets", () => {
  const api = createContentApi(fakeSource());

  it("getWeightRange spans all hair variants", () => {
    expect(api.getWeightRange()).toEqual({ min: 50, max: 150 });
  });

  it("getLengths lists distinct lengths in order", () => {
    expect(api.getLengths()).toEqual([40, 50, 60, 70]);
  });

  it("getAttachments returns all five in canonical order", () => {
    expect(api.getAttachments()).toEqual([
      "tape-classic",
      "imitation-1",
      "imitation-2",
      "bio-tape",
      "ring-star",
    ]);
  });
});

describe("validation", () => {
  it("throws on an invalid product", () => {
    const api = createContentApi(fakeSource([{ slug: "broken" }]));
    expect(() => api.getAllProducts()).toThrow(/broken/);
  });

  it("rejects a material field in a hair product", () => {
    const api = createContentApi(fakeSource([{ ...hair({ slug: "mixed" }), compatibleWith: [] }]));
    expect(() => api.getAllProducts()).toThrow(/mixed/);
  });

  it("rejects a hair field in a material", () => {
    const api = createContentApi(fakeSource([{ ...material({ slug: "mixed-m" }), origin: "slavic" }]));
    expect(() => api.getAllProducts()).toThrow(/mixed-m/);
  });

  it("rejects duplicate slugs", () => {
    const api = createContentApi(fakeSource([hair({ slug: "dup" }), material({ slug: "dup" })]));
    expect(() => api.getAllProducts()).toThrow(/dup/);
  });

  it("real content files pass validation and every hair colour exists in the palette", () => {
    const api = createContentApi(fileContentSource);
    const palette = new Set(api.getColors().map((c) => c.code));
    expect(api.getHairProducts().length).toBeGreaterThan(0);
    expect(api.getMaterials()).toHaveLength(4);
    for (const product of api.getHairProducts()) {
      for (const v of product.variants) {
        expect(palette.has(v.color), `${product.slug}: ${v.color}`).toBe(true);
      }
    }
  });
});
