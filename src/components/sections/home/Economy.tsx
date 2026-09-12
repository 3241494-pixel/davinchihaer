import { Badge } from "@/components/ui/Badge";
import { getTypedMessages } from "@/i18n/get-messages";

export async function Economy() {
  const ru = await getTypedMessages();
  const { tapeIn, capsule } = ru.home.economy;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-3xl text-ink-strong">{ru.home.economy.heading}</h2>
        <p className="text-base text-ink-muted">{ru.home.economy.description}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-base border border-border bg-surface p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink-strong">{ru.home.economy.comparisonTitle}</span>
          <Badge variant="outline" tone="danger">
            TODO_CLIENT
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 rounded-base border border-border bg-bg p-4">
            <span className="font-medium text-ink-strong">{tapeIn.label}</span>
            <span className="text-sm text-ink-muted">{tapeIn.note}</span>
            <span className="mt-2 font-heading text-2xl text-ink-strong">{tapeIn.price}</span>
          </div>
          <div className="flex flex-col gap-1 rounded-base border border-border bg-bg p-4">
            <span className="font-medium text-ink-strong">{capsule.label}</span>
            <span className="text-sm text-ink-muted">{capsule.note}</span>
            <span className="mt-2 font-heading text-2xl text-ink-strong">{capsule.price}</span>
          </div>
        </div>
        <p className="text-xs text-ink-muted">{ru.home.economy.disclaimer}</p>
      </div>
    </div>
  );
}
