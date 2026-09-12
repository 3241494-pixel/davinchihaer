import { getTypedMessages } from "@/i18n/get-messages";
import type { ProductCategory } from "@/lib/content/types";

export interface CategoryIntroProps {
  category?: ProductCategory;
}

export async function CategoryIntro({ category }: CategoryIntroProps) {
  const ru = await getTypedMessages();
  const heading = category ? ru.categories[category] : ru.catalog.heading;
  const paragraphs = category ? ru.catalog.categoryIntro[category] : undefined;

  return (
    <header className="flex flex-col gap-4 py-8 md:py-12">
      <h1 className="font-heading text-4xl text-ink-strong">{heading}</h1>
      {paragraphs?.map((paragraph, index) => (
        <p key={index} className="max-w-3xl text-base text-ink-muted">
          {paragraph}
        </p>
      ))}
    </header>
  );
}
