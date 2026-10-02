import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/home/Hero";
import { Marquee } from "@/components/sections/home/Marquee";
import { FounderQuote } from "@/components/content/FounderQuote";
import { Techniques } from "@/components/sections/home/Techniques";
import { WhyTapeIn } from "@/components/sections/home/WhyTapeIn";
import { PopularProducts } from "@/components/sections/home/PopularProducts";
import { Economy } from "@/components/sections/home/Economy";
import { ColorGuideTeaser } from "@/components/sections/home/ColorGuideTeaser";
import {
  BeforeAfterGallery,
  hasBeforeAfterPhotos,
} from "@/components/sections/home/BeforeAfterGallery";
import { VideoShowcase } from "@/components/content/VideoShowcase";
import { LeadActions } from "@/components/content/LeadActions";
import { CtaBand } from "@/components/content/CtaBand";
import { getTypedMessages } from "@/i18n/get-messages";
import { FunnelBanners } from "@/components/sections/home/FunnelBanners";
import { Reviews } from "@/components/sections/home/Reviews";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { ContactLeadSection } from "@/components/sections/home/ContactLeadSection";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ru = await getTypedMessages();

  return (
    <>
      <Hero />
      <Marquee />

      <Section tone="surface">
        <Container>
          <Techniques />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <WhyTapeIn />
        </Container>
      </Section>

      <VideoShowcase
        names={["installOnModel", "bio1", "darkPiece1"]}
        locale={locale}
        eyebrow={ru.home.showcase.eyebrow}
        heading={ru.home.showcase.heading}
        text={ru.home.showcase.text}
        actions={
          <LeadActions
            locale={locale}
            leadLabel={ru.ctaBand.primary}
            telegramLabel={ru.ctaBand.telegram}
          />
        }
      />

      <Section tone="surface">
        <Container>
          <PopularProducts />
        </Container>
      </Section>

      <CtaBand tone="dark" />

      <Section tone="surface-alt">
        <Container>
          <Economy />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <ColorGuideTeaser />
        </Container>
      </Section>

      {hasBeforeAfterPhotos() && (
        <Section tone="surface">
          <Container>
            <BeforeAfterGallery />
          </Container>
        </Section>
      )}

      <Section tone="bg">
        <Container>
          <FunnelBanners />
        </Container>
      </Section>

      <Section tone="surface-alt">
        <Container>
          <FounderQuote />
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <Reviews />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <FaqSection />
        </Container>
      </Section>

      <Section tone="surface-alt">
        <Container>
          <ContactLeadSection />
        </Container>
      </Section>
    </>
  );
}
