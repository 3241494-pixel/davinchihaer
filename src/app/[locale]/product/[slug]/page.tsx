import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Gallery } from "@/components/product/Gallery";
import { VariantProvider } from "@/components/product/variant-context";
import { VariantSelector } from "@/components/product/VariantSelector";
import { VariantPriceActions } from "@/components/product/VariantPriceActions";
import { TrustBadges } from "@/components/product/TrustBadges";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductLeadForm } from "@/components/product/ProductLeadForm";
import {
  ProductStickyBar,
  PRODUCT_ACTIONS_ID,
} from "@/components/product/ProductStickyBar";
import { VideoShowcase } from "@/components/content/VideoShowcase";
import { LeadActions } from "@/components/content/LeadActions";
import { CtaBand } from "@/components/content/CtaBand";
import { ATTACHMENT_VIDEOS, MATERIAL_VIDEOS, VIDEOS } from "@/content/videos";
import { IMAGES } from "@/content/images";
import {
  getAllProducts,
  getColors,
  getHairFor,
  getHairProducts,
  getMaterialsFor,
  getProductBySlug,
} from "@/lib/content/products";
import { pickLocale } from "@/lib/content/locale";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { Reveal } from "@/components/ui/Reveal";
import { publicImageExists } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/content/types";

const RELATED_LIMIT = 4;

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: pickLocale(product.seo.title, locale),
    description: pickLocale(product.seo.description, locale),
    alternates: buildLanguageAlternates(`/product/${slug}`),
  };
}

/** Похожие волосы: то же крепление, затем то же происхождение. */
function getRelatedHair(product: Product): Product[] {
  if (product.kind !== "hair") return [];
  const others = getHairProducts().filter((p) => p.slug !== product.slug);
  const sameAttachment = others.filter(
    (p) => p.attachment === product.attachment,
  );
  const sameOrigin = others.filter(
    (p) => p.attachment !== product.attachment && p.origin === product.origin,
  );
  return [...sameAttachment, ...sameOrigin].slice(0, RELATED_LIMIT);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const ru = await getTypedMessages();
  const colors = getColors();
  const colorsByCode = new Map(
    colors.map((color) => [color.code, color] as const),
  );
  const related = getRelatedHair(product);
  const worksWith =
    product.kind === "hair" ? getMaterialsFor(product.attachment) : [];
  const compatibleHair =
    product.kind === "material"
      ? getHairFor(product).slice(0, RELATED_LIMIT)
      : [];
  const section = product.kind === "hair" ? "hair" : "materials";
  const galleryImages = product.images.map((image) => ({
    src: image.src,
    alt: pickLocale(image.alt, locale),
    exists: publicImageExists(image.src),
  }));

  const videos =
    product.kind === "hair"
      ? ATTACHMENT_VIDEOS[product.attachment]
      : MATERIAL_VIDEOS[product.materialType];

  return (
    <VariantProvider product={product} colors={colors}>
      <Container className="flex flex-col gap-10 py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: ru.nav.catalog, href: "/catalog" },
            { label: ru.catalogSections[section], href: `/catalog/${section}` },
            { label: pickLocale(product.title, locale) },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <Gallery
            images={galleryImages}
            placeholderLabel={ru.product.gallery.placeholder}
            video={
              videos[0]
                ? {
                    name: videos[0],
                    label: pickLocale(
                      IMAGES[VIDEOS[videos[0]].poster].alt,
                      locale,
                    ),
                  }
                : undefined
            }
          />

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-3">
              <p className="caps text-ink-muted">
                {product.kind === "hair"
                  ? ru.attachments[product.attachment]
                  : ru.materialTypes[product.materialType]}
              </p>
              <h1 className="font-heading text-[34px] leading-tight text-ink-strong md:text-[44px]">
                {pickLocale(product.title, locale)}
              </h1>
              <p className="leading-relaxed text-ink-muted">
                {pickLocale(product.shortDescription, locale)}
              </p>
            </div>
            <VariantSelector />
            <div id={PRODUCT_ACTIONS_ID}>
              <VariantPriceActions />
            </div>
            <TrustBadges />
          </div>
        </div>
      </Container>

      <VideoShowcase
        names={videos}
        locale={locale}
        eyebrow={ru.product.videos.eyebrow}
        heading={ru.product.videos.heading}
        text={ru.product.videos.text}
        actions={
          <LeadActions
            locale={locale}
            leadLabel={ru.product.cta.leadForm}
            telegramLabel={ru.product.cta.telegram}
          />
        }
      />

      <Container className="flex flex-col gap-12 py-12 md:gap-16 md:py-16">
        <Reveal>
          <ProductTabs product={product} />
        </Reveal>

        <RelatedProducts
          products={worksWith}
          colorsByCode={colorsByCode}
          heading={ru.product.worksWith.heading}
          description={ru.product.worksWith.description}
        />

        <RelatedProducts
          products={compatibleHair}
          colorsByCode={colorsByCode}
          heading={ru.product.compatibleHair.heading}
        />
      </Container>

      <CtaBand />

      <Container className="flex flex-col gap-12 py-12 md:gap-16 md:py-16">
        <RelatedProducts products={related} colorsByCode={colorsByCode} />

        <Reveal>
          <ProductLeadForm />
        </Reveal>
      </Container>

      <ProductStickyBar />
    </VariantProvider>
  );
}
