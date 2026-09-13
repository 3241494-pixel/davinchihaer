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
import { getAllProducts, getColors, getProductBySlug } from "@/lib/content/products";
import { pickLocale } from "@/lib/content/locale";
import { buildLanguageAlternates } from "@/i18n/alternates";
import { Reveal } from "@/components/ui/Reveal";
import { publicImageExists } from "@/lib/image-exists";
import { getTypedMessages } from "@/i18n/get-messages";
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
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: pickLocale(product.seo.title, locale),
    description: pickLocale(product.seo.description, locale),
    alternates: buildLanguageAlternates(`/product/${slug}`),
  };
}

function getRelatedProducts(product: Product): Product[] {
  const resolved = (product.relatedSlugs ?? [])
    .map((relatedSlug) => getProductBySlug(relatedSlug))
    .filter((related): related is Product => Boolean(related) && related!.slug !== product.slug);

  if (resolved.length > 0) return resolved.slice(0, RELATED_LIMIT);

  return getAllProducts()
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, RELATED_LIMIT);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const ru = await getTypedMessages();
  const colors = getColors();
  const colorsByCode = new Map(colors.map((color) => [color.code, color] as const));
  const related = getRelatedProducts(product);
  const galleryImages = product.images.map((image) => ({
    src: image.src,
    alt: pickLocale(image.alt, locale),
    exists: publicImageExists(image.src),
  }));

  return (
    <VariantProvider product={product} colors={colors}>
      <Container className="flex flex-col gap-10 py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: ru.nav.catalog, href: "/catalog" },
            { label: ru.categories[product.category], href: `/catalog/${product.category}` },
            { label: pickLocale(product.title, locale) },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Gallery images={galleryImages} placeholderLabel={ru.product.gallery.placeholder} />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-heading text-3xl text-ink-strong">{pickLocale(product.title, locale)}</h1>
              <p className="text-base text-ink-muted">{pickLocale(product.shortDescription, locale)}</p>
            </div>
            <VariantSelector />
            <VariantPriceActions />
            <TrustBadges />
          </div>
        </div>

        <Reveal>
          <ProductTabs product={product} />
        </Reveal>

        <RelatedProducts products={related} colorsByCode={colorsByCode} />

        <Reveal>
          <ProductLeadForm />
        </Reveal>
      </Container>
    </VariantProvider>
  );
}
