import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getAllProducts, getCategories, getColors } from "@/lib/content/products";
import { buildImageExistsMap } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { ProductCategory } from "@/lib/content/types";
import type { Locale } from "@/i18n/routing";

function isProductCategory(value: string): value is ProductCategory {
  return (getCategories() as string[]).includes(value);
}

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

type PageProps = { params: Promise<{ locale: Locale; category: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!isProductCategory(category)) return {};
  const ru = await getTypedMessages();
  return {
    title: `${ru.categories[category]} | Da Vinchi Hair`,
    alternates: buildLanguageAlternates(`/catalog/${category}`),
  };
}

export default async function CatalogCategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isProductCategory(category)) {
    notFound();
  }

  const products = getAllProducts().filter((product) => product.category === category);
  const colors = getColors();
  const imageExistsBySlug = buildImageExistsMap(products);

  return (
    <CatalogView
      pathname={`/catalog/${category}`}
      lockedCategory={category}
      products={products}
      colors={colors}
      imageExistsBySlug={imageExistsBySlug}
    />
  );
}
