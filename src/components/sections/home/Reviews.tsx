import { Card } from "@/components/ui/Card";
import { getTypedMessages } from "@/i18n/get-messages";

export async function Reviews() {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.home.reviews.heading}</h2>
      <p className="text-sm text-ink-muted">{ru.home.reviews.todoNote}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {ru.home.reviews.items.map((review, index) => (
          <Card key={index} className="flex flex-col gap-3">
            <p className="text-sm text-ink-muted">{review.text}</p>
            <span className="mt-auto text-sm font-medium text-ink-strong">{review.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
