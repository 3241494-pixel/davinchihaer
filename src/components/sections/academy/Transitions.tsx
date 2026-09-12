import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ru } from "@/i18n/messages";

export function Transitions() {
  const { online, offline } = ru.academy.hub.transitions;
  const cards = [online, offline];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.href} className="flex flex-col gap-3">
          <h2 className="font-heading text-xl text-ink-strong">{card.title}</h2>
          <p className="text-sm text-ink-muted">{card.description}</p>
          <Button asChild variant="secondary" className="mt-auto self-start">
            <Link href={card.href}>{card.cta}</Link>
          </Button>
        </Card>
      ))}
    </div>
  );
}
