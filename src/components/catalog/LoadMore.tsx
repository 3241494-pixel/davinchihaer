import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { buildCatalogHref, type EditableFilters } from "@/lib/catalog/search-params";
import { ru } from "@/i18n/messages";

export interface LoadMoreProps {
  pathname: string;
  filters: EditableFilters;
  nextLimit: number;
}

export function LoadMore({ pathname, filters, nextLimit }: LoadMoreProps) {
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
