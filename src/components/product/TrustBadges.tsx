import { IconHand, IconPalette, IconRefresh, IconShield } from "@/components/ui/icons";
import { getTypedMessages } from "@/i18n/get-messages";

export async function TrustBadges() {
  const ru = await getTypedMessages();
  const ITEMS = [
    { Icon: IconShield, title: ru.product.trust.gentleTitle, description: ru.product.trust.gentleDescription },
    { Icon: IconRefresh, title: ru.product.trust.durableTitle, description: ru.product.trust.durableDescription },
    { Icon: IconHand, title: ru.product.trust.selfCorrectionTitle, description: ru.product.trust.selfCorrectionDescription },
    { Icon: IconPalette, title: ru.product.trust.colorMatchTitle, description: ru.product.trust.colorMatchDescription },
  ] as const;

  return (
    <ul className="grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2">
      {ITEMS.map(({ Icon, title, description }) => (
        <li key={title} className="flex items-start gap-3">
          <Icon className="mt-0.5 size-5 shrink-0 text-ink-strong" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-ink-strong">{title}</span>
            <span className="text-sm text-ink-muted">{description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
