import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Button } from "@/components/ui/Button";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { getColors } from "@/lib/content/products";
import { getPageContent } from "@/lib/content/pages";
import { buildTelegramLink } from "@/lib/messenger";
import { ru } from "@/i18n/messages";

export const metadata: Metadata = {
  title: `${ru.pages.guides.colorMatch.title} | Da Vinchi Hair`,
  description: ru.pages.guides.colorMatch.description,
};

export default async function ColorMatchPage() {
  const page = await getPageContent("guides/color-match");
  const Content = page?.default;
  const colors = getColors();
  const telegramHref = buildTelegramLink();
  const copy = ru.pages.guides.colorMatch;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[
        { label: ru.nav.guides, href: "/guides" },
        { label: copy.title },
      ]}
      after={
        <div className="flex flex-col gap-10 border-t border-border pt-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.paletteHeading}</h2>
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => (
                <ColorSwatch
                  key={color.code}
                  code={color.code}
                  hex={color.hex}
                  swatchImage={color.swatchImage}
                  label={color.name.ru}
                  tabIndex={-1}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-base border border-border bg-surface p-6">
            <h2 className="font-heading text-xl text-ink-strong">{copy.photoCalloutTitle}</h2>
            <p className="max-w-xl text-sm text-ink-muted">{copy.photoCalloutText}</p>
            <Button asChild variant="secondary" className="self-start">
              <a href={telegramHref} target="_blank" rel="noopener noreferrer">
                {copy.photoCalloutCta}
              </a>
            </Button>
          </div>
        </div>
      }
    >
      {Content && <Content />}
    </ContentPageLayout>
  );
}
