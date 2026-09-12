import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/home/Hero";
import { Techniques } from "@/components/sections/home/Techniques";
import { WhyTapeIn } from "@/components/sections/home/WhyTapeIn";
import { PopularProducts } from "@/components/sections/home/PopularProducts";
import { Economy } from "@/components/sections/home/Economy";
import { ColorGuideTeaser } from "@/components/sections/home/ColorGuideTeaser";
import { BeforeAfterGallery } from "@/components/sections/home/BeforeAfterGallery";
import { FunnelBanners } from "@/components/sections/home/FunnelBanners";
import { Reviews } from "@/components/sections/home/Reviews";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { ContactLeadSection } from "@/components/sections/home/ContactLeadSection";

export default function Home() {
  return (
    <>
      <Hero />

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

      <Section tone="surface">
        <Container>
          <PopularProducts />
        </Container>
      </Section>

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

      <Section tone="surface">
        <Container>
          <BeforeAfterGallery />
        </Container>
      </Section>

      <Section tone="bg">
        <Container>
          <FunnelBanners />
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
