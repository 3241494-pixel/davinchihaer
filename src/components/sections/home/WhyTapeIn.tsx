import { IconBolt, IconEyeOff, IconHand, IconRefresh, IconShield } from "@/components/ui/icons";
import { getTypedMessages } from "@/i18n/get-messages";

const ICONS = [IconBolt, IconEyeOff, IconShield, IconRefresh, IconHand];

export async function WhyTapeIn() {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.home.why.heading}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ru.home.why.items.map((item, index) => {
          const Icon = ICONS[index];
          return (
            <li key={item.title} className="flex flex-col gap-2">
              <Icon className="size-6 text-ink-strong" />
              <span className="font-medium text-ink-strong">{item.title}</span>
              <span className="text-sm text-ink-muted">{item.description}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
