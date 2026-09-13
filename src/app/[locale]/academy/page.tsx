import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/academy/Hero";
import { FormatComparison } from "@/components/sections/academy/FormatComparison";
import { ProgramBlocks } from "@/components/sections/academy/ProgramBlocks";
import { Reviews } from "@/components/sections/academy/Reviews";
import { Transitions } from "@/components/sections/academy/Transitions";
import { FaqSection } from "@/components/sections/academy/FaqSection";
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
    title: `${ru.academy.hub.title} | Da Vinchi Hair`,
    description: ru.academy.hub.subtitle,
    alternates: buildLanguageAlternates("/academy"),
  };
}

export default async function AcademyHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();
  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs items={[{ label: ru.nav.academy }]} />
      </Container>

      <Hero />

      <Section tone="surface">
        <Container>
          <FormatComparison />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <ProgramBlocks />
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <Reviews />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <Transitions />
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <FaqSection />
        </Container>
      </Section>
    </>
  );
}
