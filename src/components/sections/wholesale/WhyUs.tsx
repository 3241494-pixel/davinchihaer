import { IconHand, IconPalette, IconRefresh, IconShield, IconTruck } from "@/components/ui/icons";
import { ru } from "@/i18n/messages";

const ICONS = [IconPalette, IconRefresh, IconTruck, IconHand, IconShield];

export function WhyUs() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.wholesale.whyUs.heading}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ru.wholesale.whyUs.items.map((item, index) => {
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
