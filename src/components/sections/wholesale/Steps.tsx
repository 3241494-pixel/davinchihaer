import { getTypedMessages } from "@/i18n/get-messages";

export async function Steps() {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.wholesale.steps.heading}</h2>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ru.wholesale.steps.items.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2">
            <span className="font-heading text-2xl text-ink-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-medium text-ink-strong">{step.title}</span>
            <span className="text-sm text-ink-muted">{step.description}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
