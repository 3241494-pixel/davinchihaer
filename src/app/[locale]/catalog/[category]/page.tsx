import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getCategories } from "@/lib/content/products";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { ProductCategory } from "@/lib/content/types";
import type { RawSearchParams } from "@/lib/catalog/search-params";

function isProductCategory(value: string): value is ProductCategory {
  return (getCategories() as string[]).includes(value);
}

export function generateStaticParams() {
  return getCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isProductCategory(category)) return {};
  const ru = await getTypedMessages();
  return {
    title: `${ru.categories[category]} | Da Vinchi Hair`,
    alternates: buildLanguageAlternates(`/catalog/${category}`),
  };
}

export default async function CatalogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const [{ category }, resolvedSearchParams] = await Promise.all([params, searchParams]);

  if (!isProductCategory(category)) {
    notFound();
  }

  return (
    <CatalogView
      pathname={`/catalog/${category}`}
      lockedCategory={category}
      searchParams={resolvedSearchParams}
    />
  );
}
