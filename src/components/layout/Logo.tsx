import Image from "next/image";
import Link from "next/link";
import { ru } from "@/i18n/messages";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label={ru.header.logoAlt}
      className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
    >
      <Image src="/logo.svg" alt="" width={36} height={36} priority className="size-9" />
      <span className="font-heading text-2xl leading-none font-semibold text-ink-strong">
        Da Vinchi Hair
      </span>
    </Link>
  );
}
