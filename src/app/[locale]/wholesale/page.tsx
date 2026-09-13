import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/wholesale/Hero";
import { Terms } from "@/components/sections/wholesale/Terms";
import { WhyUs } from "@/components/sections/wholesale/WhyUs";
import { Assortment } from "@/components/sections/wholesale/Assortment";
import { Steps } from "@/components/sections/wholesale/Steps";
import { FaqSection } from "@/components/sections/wholesale/FaqSection";
import { WholesaleFormSection } from "@/components/sections/wholesale/WholesaleFormSection";
import { ContactNote } from "@/components/sections/wholesale/ContactNote";
import { getTypedMessages } from "@/i18n/get-messages";
import { setRequestLocale } from "next-intl/server";
import { buildLanguageAlternates } from "@/i18n/alternates";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return {
    title: `${ru.wholesale.hero.title} | Da Vinchi Hair`,
    description: ru.wholesale.hero.subtitle,
    alternates: buildLanguageAlternates("/wholesale"),
  };
}

export default async function WholesalePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs items={[{ label: ru.nav.wholesale }]} />
      </Container>

      <Hero />

      <Section tone="surface">
        <Container>
          <Terms />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <WhyUs />
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <Assortment />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <Steps />
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <FaqSection />
        </Container>
      </Section>

      <Section tone="surface-alt">
        <Container className="grid gap-10 lg:grid-cols-2">
          <WholesaleFormSection />
          <ContactNote />
        </Container>
      </Section>
    </>
  );
}
