import { Link } from "@/i18n/navigation";
import { cn } from "./cn";
import { getTypedMessages } from "@/i18n/get-messages";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  homeLabel?: string;
  homeHref?: string;
}

export async function Breadcrumbs({
  items,
  className,
  homeLabel,
  homeHref = "/",
}: BreadcrumbsProps) {
  const ru = await getTypedMessages();
  const allItems: BreadcrumbItem[] = [
    { label: homeLabel ?? ru.breadcrumbs.home, href: homeHref },
    ...items,
  ];

  return (
    <nav aria-label={ru.breadcrumbs.ariaLabel} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden className="text-ink-muted">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
