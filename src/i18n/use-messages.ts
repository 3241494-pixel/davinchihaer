"use client";

import { useMessages } from "next-intl";
import type { Messages } from "./messages-type";

export type { Messages };

/**
 * Клиентский компонент: дерево сообщений текущей локали. Живёт в отдельном
 * от getTypedMessages модуле — тот импортирует next-intl/server, и если бы
 * обе функции были в одном файле, клиентский бандл затянул бы этот импорт
 * и упал с "getMessages is not supported in Client Components".
 */
export function useTypedMessages(): Messages {
  return useMessages() as unknown as Messages;
}
