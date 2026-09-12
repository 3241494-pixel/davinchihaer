import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";

export interface ContentPageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
  /** Контент под основным телом — таблицы, CTA, формы, карточки. */
  after?: ReactNode;
  /** Контент шире стандартной ширины текста (max-w-3xl), например сетки карточек. */
  wide?: ReactNode;
}

/** Общий шаблон контентной страницы (этап 8): хлебные крошки + заголовок + MDX-тело. */
export function ContentPageLayout({
  title,
  description,
  breadcrumbs,
  children,
  after,
  wide,
}: ContentPageLayoutProps) {
  return (
    <Container className="flex flex-col gap-10 py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <Breadcrumbs items={breadcrumbs} />
        <header className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl text-ink-strong">{title}</h1>
          {description && <p className="max-w-2xl text-lg text-ink-muted">{description}</p>}
        </header>
        {children && <div className="max-w-3xl">{children}</div>}
      </div>
      {wide}
      {after}
    </Container>
  );
}
