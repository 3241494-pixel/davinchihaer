/**
 * Дублирование заявок на email через Resend HTTP API напрямую (без SDK —
 * чтобы не тянуть новую зависимость ради одного POST-запроса).
 * Отсутствие RESEND_API_KEY не считается ошибкой — просто пропускаем отправку.
 */
export interface EmailSendResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendLeadEmail(subject: string, html: string): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: true, skipped: true };
  }

  const to = process.env.LEADS_EMAIL_TO;
  const from = process.env.LEADS_EMAIL_FROM ?? "Da Vinchi Hair <leads@resend.dev>";

  if (!to) {
    return { ok: false, error: "RESEND_API_KEY задан, но LEADS_EMAIL_TO не настроен" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { ok: false, error: `Resend API ${response.status}: ${body.slice(0, 300)}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Неизвестная ошибка сети" };
  }
}
