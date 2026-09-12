import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/content/ContentPageLayout";
import { Badge } from "@/components/ui/Badge";
import { TrainingLeadForm } from "@/components/forms/TrainingLeadForm";
import { getTypedMessages } from "@/i18n/get-messages";
import { buildLanguageAlternates } from "@/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const ru = await getTypedMessages();
  return {
  alternates: buildLanguageAlternates("/academy/online"),
  title: `${ru.academy.online.title} | Da Vinchi Hair`,
  description: ru.academy.online.description,
};
}

export default async function AcademyOnlinePage() {
  const ru = await getTypedMessages();
  const copy = ru.academy.online;

  return (
    <ContentPageLayout
      title={copy.title}
      description={copy.description}
      breadcrumbs={[
        { label: ru.nav.academy, href: "/academy" },
        { label: ru.academy.nav.online },
      ]}
      after={
        <div className="flex flex-col gap-10 border-t border-border pt-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.programHeading}</h2>
            <ul className="flex flex-col gap-2">
              {copy.program.map((item) => (
                <li
                  key={item.module}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2"
                >
                  <span className="text-ink">{item.module}</span>
                  <span className="text-sm text-ink-muted">{item.duration}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.requirementsHeading}</h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-ink">
              {copy.requirements.map((item) => (
                <li key={item} className="pl-1 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.processHeading}</h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {copy.processSteps.map((step, index) => (
                <li key={step.title} className="flex flex-col gap-1">
                  <span className="font-heading text-xl text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-ink-strong">{step.title}</span>
                  <span className="text-sm text-ink-muted">{step.description}</span>
                </li>
              ))}
            </ol>
            <p className="text-sm text-ink-muted">{copy.accessNote}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.supportHeading}</h2>
            <p className="text-sm text-ink-muted">{copy.supportText}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.priceHeading}</h2>
            <Badge variant="outline" tone="danger" className="self-start">
              {copy.priceValue}
            </Badge>
          </div>

          <div id="lead-form" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-heading text-2xl text-ink-strong">{copy.formHeading}</h2>
            <div className="max-w-xl">
              <TrainingLeadForm defaultFormat="online" />
            </div>
          </div>
        </div>
      }
    />
  );
}
