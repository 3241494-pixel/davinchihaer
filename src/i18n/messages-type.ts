import type { MESSAGES_BY_LOCALE } from "./request";

/**
 * Полное дерево сообщений (ru.json — эталон структуры для всех локалей).
 * Тип вынесен в отдельный from-server-and-client-safe модуль: он импортирует
 * только тип (`import type`, стирается при компиляции), поэтому не тянет
 * next-intl/server в клиентские бандлы, в отличие от get-messages.ts.
 */
export type Messages = (typeof MESSAGES_BY_LOCALE)["ru"];
