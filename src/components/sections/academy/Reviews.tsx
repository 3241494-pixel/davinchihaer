import { Card } from "@/components/ui/Card";
import { ru } from "@/i18n/messages";

export function Reviews() {
  const { reviewsHeading, reviewsTodo, reviews } = ru.academy.hub;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{reviewsHeading}</h2>
      <p className="text-sm text-ink-muted">{reviewsTodo}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {reviews.map((review, index) => (
          <Card key={index} className="flex flex-col gap-3">
            <p className="text-sm text-ink-muted">{review.text}</p>
            <span className="mt-auto text-sm font-medium text-ink-strong">{review.name}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
