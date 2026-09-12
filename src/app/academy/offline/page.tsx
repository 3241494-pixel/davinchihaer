import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Badge } from "@/components/ui/Badge";
import { TrainingLeadForm } from "@/components/forms/TrainingLeadForm";
import { BeforeAfterLightbox as PhotoLightbox } from "@/components/sections/home/BeforeAfterLightbox";
import { siteConfig } from "@/config/site";
import { publicImageExists } from "@/lib/image-exists";
import { ru } from "@/i18n/messages";

export const metadata: Metadata = {
  title: `${ru.academy.offline.title} | Da Vinchi Hair`,
  description: ru.academy.offline.description,
};

export default function AcademyOfflinePage() {
  const copy = ru.academy.offline;

  const photos = Array.from({ length: 4 }, (_, index) => {
    const src = `/images/academy/offline-${index + 1}.jpg`;
    return { src, alt: copy.photosHeading, exists: publicImageExists(src) };
  });

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[
        { label: ru.nav.academy, href: "/academy" },
        { label: ru.academy.nav.offline },
      ]}
      after={
        <div className="flex flex-col gap-10 border-t border-border pt-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.programHeading}</h2>
            <ul className="flex flex-col gap-3">
              {copy.program.map((item) => (
                <li key={item.day} className="flex flex-col gap-1 border-b border-border pb-3">
                  <span className="font-medium text-ink-strong">{item.day}</span>
                  <span className="text-sm text-ink-muted">{item.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.detailsHeading}</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {copy.details.map((detail) => (
                <div key={detail.label} className="flex flex-col gap-1">
                  <dt className="text-sm text-ink-muted">{detail.label}</dt>
                  <dd className="font-medium text-ink-strong">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.addressHeading}</h2>
            <p className="text-sm text-ink-muted">
              {siteConfig.address.street && `${siteConfig.address.street}, `}
              {siteConfig.address.city}, {siteConfig.address.country}
            </p>
            <p className="text-xs text-ink-muted">{copy.addressTodo}</p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.includedHeading}</h2>
            <dl className="grid gap-4 sm:grid-cols-3">
              {copy.included.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="text-sm text-ink-muted">{item.label}</dt>
                  <dd>
                    <Badge variant="outline" tone="danger">
                      {item.value}
                    </Badge>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.scheduleHeading}</h2>
            <p className="text-sm text-ink-muted">{copy.scheduleValue}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.priceHeading}</h2>
            <Badge variant="outline" tone="danger" className="self-start">
              {copy.priceValue}
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.photosHeading}</h2>
            <PhotoLightbox images={photos} />
            <p className="text-xs text-ink-muted">{copy.photosNote}</p>
          </div>

          <div id="lead-form" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.formHeading}</h2>
            <div className="max-w-xl">
              <TrainingLeadForm defaultFormat="offline" />
            </div>
          </div>
        </div>
      }
    />
  );
}
