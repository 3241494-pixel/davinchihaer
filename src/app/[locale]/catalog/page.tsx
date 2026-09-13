import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getAllProducts, getColors } from "@/lib/content/products";
import { buildImageExistsMap } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
    title: `${ru.catalog.heading} | Da Vinchi Hair`,
  };
}

export default async function CatalogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = getAllProducts();
  const colors = getColors();
  const imageExistsBySlug = buildImageExistsMap(products);

  return (
    <CatalogView
      pathname="/catalog"
      products={products}
      colors={colors}
      imageExistsBySlug={imageExistsBySlug}
    />
  );
}
