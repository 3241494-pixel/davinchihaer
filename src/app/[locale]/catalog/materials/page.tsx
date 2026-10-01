import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { CategoryIntro } from "@/components/catalog/CategoryIntro";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getColors, getMaterials } from "@/lib/content/products";
import { buildImageExistsMap } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
    title: `${ru.catalogSections.materials} | Da Vinchi Hair`,
    description: ru.catalog.sectionIntro.materials[0],
    alternates: buildLanguageAlternates("/catalog/materials"),
  };
}

/** Товаров четыре — без фильтров, простой список. */
export default async function CatalogMaterialsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const materials = getMaterials();
  const colorsByCode = new Map(getColors().map((color) => [color.code, color] as const));

  return (
    <Container className="pb-16">
      <CategoryIntro section="materials" />
      <ProductGrid
        products={materials}
        colorsByCode={colorsByCode}
        imageExistsBySlug={buildImageExistsMap(materials)}
      />
    </Container>
  );
}
