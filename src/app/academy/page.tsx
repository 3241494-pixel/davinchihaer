import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/academy/Hero";
import { FormatComparison } from "@/components/sections/academy/FormatComparison";
import { ProgramBlocks } from "@/components/sections/academy/ProgramBlocks";
import { Reviews } from "@/components/sections/academy/Reviews";
import { Transitions } from "@/components/sections/academy/Transitions";
import { FaqSection } from "@/components/sections/academy/FaqSection";
import { ru } from "@/i18n/messages";

export default function AcademyHubPage() {
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
