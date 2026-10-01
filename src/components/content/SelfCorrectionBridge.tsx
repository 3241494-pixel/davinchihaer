import { Link } from "@/i18n/navigation";

export interface SelfCorrectionBridgeProps {
  text: string;
  links: { href: string; label: string }[];
}

/**
 * Связка «самостоятельная коррекция ↔ обучение» (бриф, раздел 2): мост из розницы
 * в обучение должен быть прошит ссылками в обе стороны.
 */
export function SelfCorrectionBridge({ text, links }: SelfCorrectionBridgeProps) {
  return (
    <div className="flex flex-col gap-3 bg-surface px-5 py-5">
      <p className="text-ink">{text}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="caps text-ink underline decoration-border underline-offset-4 transition-colors duration-200 hover:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
