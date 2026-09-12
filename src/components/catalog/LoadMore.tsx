import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { buildCatalogHref, type EditableFilters } from "@/lib/catalog/search-params";
import { getTypedMessages } from "@/i18n/get-messages";

export interface LoadMoreProps {
  pathname: string;
  filters: EditableFilters;
  nextLimit: number;
}

export async function LoadMore({ pathname, filters, nextLimit }: LoadMoreProps) {
  const ru = await getTypedMessages();
  return (
    <div className="flex justify-center py-8">
      <Button asChild variant="secondary">
        <Link href={buildCatalogHref(pathname, filters, { limit: nextLimit })} scroll={false}>
          {ru.catalog.loadMore}
        </Link>
      </Button>
    </div>
  );
}
