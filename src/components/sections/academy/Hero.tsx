import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ru } from "@/i18n/messages";

export function Hero() {
  const { title, subtitle, audiences } = ru.academy.hub;

  return (
    <Container className="flex flex-col gap-8 py-10 md:py-16">
      <div className="flex flex-col gap-4">
        <h1 className="max-w-3xl font-heading text-4xl text-ink-strong md:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg text-ink-muted">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-xl text-ink-strong">{audiences.heading}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-base border border-border bg-surface p-6">
            <span className="font-medium text-ink-strong">{audiences.beginners.title}</span>
            <span className="text-sm text-ink-muted">{audiences.beginners.description}</span>
          </div>
          <div className="flex flex-col gap-2 rounded-base border border-border bg-surface p-6">
            <span className="font-medium text-ink-strong">{audiences.selfCorrection.title}</span>
            <span className="text-sm text-ink-muted">{audiences.selfCorrection.description}</span>
            <Link
              href={audiences.selfCorrection.linkHref}
              className="text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              {audiences.selfCorrection.linkText}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
