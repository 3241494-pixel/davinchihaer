"use client";

import { useTypedMessages } from "@/i18n/use-messages";
import type { CatalogSection } from "@/lib/content/types";

export interface CategoryIntroProps {
  section: CatalogSection;
}

export function CategoryIntro({ section }: CategoryIntroProps) {
  const ru = useTypedMessages();
  const paragraphs = ru.catalog.sectionIntro[section];

  return (
    <header className="flex flex-col gap-4 py-8 md:py-12">
      <h1 className="font-heading text-4xl text-ink-strong">{ru.catalogSections[section]}</h1>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="max-w-3xl text-base text-ink-muted">
          {paragraph}
        </p>
      ))}
    </header>
  );
}
