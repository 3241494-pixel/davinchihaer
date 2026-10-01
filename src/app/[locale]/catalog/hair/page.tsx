import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getColors, getHairProducts, getWeightRange } from "@/lib/content/products";
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
    title: `${ru.catalogSections.hair} | Da Vinchi Hair`,
    description: ru.catalog.sectionIntro.hair[0],
    alternates: buildLanguageAlternates("/catalog/hair"),
  };
}

export default async function CatalogHairPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = getHairProducts();

  return (
    <CatalogView
      pathname="/catalog/hair"
      products={products}
      colors={getColors()}
      weightRange={getWeightRange()}
      imageExistsBySlug={buildImageExistsMap(products)}
    />
  );
}
