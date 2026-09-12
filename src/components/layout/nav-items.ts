import type { Messages } from "@/i18n/get-messages";

export function getNavItems(ru: Messages) {
  return [
    { href: "/technology", label: ru.nav.technology },
    { href: "/guides", label: ru.nav.guides },
    { href: "/academy", label: ru.nav.academy },
    { href: "/wholesale", label: ru.nav.wholesale },
    { href: "/about", label: ru.nav.about },
    { href: "/contacts", label: ru.nav.contacts },
  ] as const;
}
