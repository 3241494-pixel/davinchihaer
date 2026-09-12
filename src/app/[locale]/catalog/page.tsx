import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { getTypedMessages } from "@/i18n/get-messages";
import type { RawSearchParams } from "@/lib/catalog/search-params";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  title: `${ru.catalog.heading} | Da Vinchi Hair`,
};
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return <CatalogView pathname="/catalog" searchParams={resolvedSearchParams} />;
}
