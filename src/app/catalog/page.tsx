import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { ru } from "@/i18n/messages";
import type { RawSearchParams } from "@/lib/catalog/search-params";

export const metadata: Metadata = {
  title: `${ru.catalog.heading} | Da Vinchi Hair`,
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return <CatalogView pathname="/catalog" searchParams={resolvedSearchParams} />;
}
