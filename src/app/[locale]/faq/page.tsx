import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { getTypedMessages } from "@/i18n/get-messages";
import { setRequestLocale } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/faq"),
  title: `${ru.pages.faqPage.title} | Da Vinchi Hair`,
};
}

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  const { categories } = ru.pages.faqPage;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ),
  };

  return (
    <ContentPageLayout
      title={ru.pages.faqPage.title}
      breadcrumbs={[{ label: ru.pages.faqPage.title }]}
      wide={
        <div className="flex max-w-3xl flex-col gap-10">
          {categories.map((category) => (
            <div key={category.title} className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl text-ink-strong">{category.title}</h2>
              <Accordion type="single">
                {category.items.map((item, index) => (
                  <AccordionItem key={index} value={`${category.title}-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </ContentPageLayout>
  );
}
