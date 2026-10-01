import { IconBolt, IconEyeOff, IconHand, IconRefresh, IconShield } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { getTypedMessages } from "@/i18n/get-messages";

const ICONS = [IconBolt, IconEyeOff, IconShield, IconRefresh, IconHand];
/** «Самостоятельная коррекция» — мост из розницы в обучение (бриф, раздел 2). */
const SELF_CORRECTION_INDEX = 4;

export async function WhyTapeIn() {
  const ru = await getTypedMessages();
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-[32px] leading-tight md:text-[44px] text-ink-strong">{ru.home.why.heading}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {ru.home.why.items.map((item, index) => {
          const Icon = ICONS[index];
          return (
            <li key={item.title} className="flex flex-col gap-2">
              <Icon className="size-6 text-ink-strong" />
              <span className="font-medium text-ink-strong">{item.title}</span>
              <span className="text-sm text-ink-muted">{item.description}</span>
              {index === SELF_CORRECTION_INDEX && (
                <Link
                  href="/guides/self-correction"
                  className="caps mt-1 self-start text-ink underline decoration-border underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                >
                  {ru.home.why.selfCorrectionLink}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
