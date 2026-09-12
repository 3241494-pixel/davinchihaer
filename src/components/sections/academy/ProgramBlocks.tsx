import { getTypedMessages } from "@/i18n/get-messages";

export async function ProgramBlocks() {
  const ru = await getTypedMessages();
  const { programHeading, programBlocks } = ru.academy.hub;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{programHeading}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {programBlocks.map((block) => (
          <li key={block.title} className="flex flex-col gap-2">
            <span className="font-medium text-ink-strong">{block.title}</span>
            <span className="text-sm text-ink-muted">{block.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
