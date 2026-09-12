import { getMessages } from "next-intl/server";
import type { Messages } from "./messages-type";

export type { Messages };

/**
 * Серверный компонент: дерево сообщений текущей локали. См. use-messages.ts —
 * клиентский аналог намеренно вынесен в отдельный файл.
 */
export async function getTypedMessages(): Promise<Messages> {
  return (await getMessages()) as unknown as Messages;
}
