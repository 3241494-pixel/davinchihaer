/** Экранирование пользовательского текста для вставки в HTML (Telegram parse_mode, email). */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
