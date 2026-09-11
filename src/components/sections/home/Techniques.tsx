import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ru } from "@/i18n/messages";

const CARDS = [ru.home.techniques.classic, ru.home.techniques.imitation1, ru.home.techniques.imitation2];

export function Techniques() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.home.techniques.heading}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Card key={card.href} className="flex flex-col gap-3">
            <h3 className="font-heading text-xl text-ink-strong">{card.title}</h3>
            <p className="text-sm text-ink-muted">{card.description}</p>
            <Link
              href={card.href}
              className="mt-auto text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              {ru.home.techniques.linkLabel}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
