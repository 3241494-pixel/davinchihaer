import { Link } from "@/i18n/navigation";
import { getTypedMessages } from "@/i18n/get-messages";

export async function EmptyState({ resetHref }: { resetHref: string }) {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col items-center gap-3 rounded-base border border-border bg-surface px-6 py-16 text-center">
      <h2 className="font-heading text-xl text-ink-strong">{ru.catalog.emptyState.title}</h2>
      <p className="max-w-sm text-sm text-ink-muted">{ru.catalog.emptyState.description}</p>
      <Link
        href={resetHref}
        className="mt-2 text-sm font-medium text-ink underline-offset-4 hover:underline"
      >
        {ru.catalog.emptyState.reset}
      </Link>
    </div>
  );
}
