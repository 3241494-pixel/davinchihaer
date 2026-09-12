import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import ru from "../../messages/ru.json";
import en from "../../messages/en.json";
import ka from "../../messages/ka.json";

export const MESSAGES_BY_LOCALE = { ru, en, ka };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: MESSAGES_BY_LOCALE[locale],
  };
});
