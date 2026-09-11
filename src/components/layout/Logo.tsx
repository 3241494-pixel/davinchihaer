import Link from "next/link";
import { ru } from "@/i18n/messages";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label={ru.header.logoAlt}
      className="font-heading text-2xl leading-none font-semibold text-ink-strong transition-opacity duration-200 hover:opacity-70"
    >
      Da Vinchi Hair
    </Link>
  );
}
