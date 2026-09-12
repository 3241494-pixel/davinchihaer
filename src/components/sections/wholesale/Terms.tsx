import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getTypedMessages } from "@/i18n/get-messages";

export async function Terms() {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.wholesale.terms.heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ru.wholesale.terms.items.map((item) => (
          <Card key={item.title} className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink-strong">{item.title}</span>
            <Badge variant="outline" tone="danger" className="self-start">
              {item.value}
            </Badge>
          </Card>
        ))}
      </div>
      <p className="text-sm text-ink-muted">{ru.wholesale.terms.disclaimer}</p>
    </div>
  );
}
