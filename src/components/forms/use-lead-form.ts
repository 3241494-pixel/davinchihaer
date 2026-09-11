"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { submitLead } from "@/lib/actions/submit-lead";
import { buildTelegramLink, type MessengerMessageOptions } from "@/lib/messenger";

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";

export interface UseLeadSubmissionOptions<TValues extends FieldValues> {
  form: UseFormReturn<TValues>;
  defaultValues: TValues;
  /** Текст для ссылки «Написать сейчас в Telegram» на экране успеха. */
  telegramFallback: MessengerMessageOptions;
}

/**
 * Общее ядро логики отправки заявки поверх уже созданного react-hook-form
 * инстанса (резолвер и схему конкретная форма настраивает сама — так проще
 * с типами zodResolver, чем прятать useForm внутри общего generic-хука).
 * honeypot держим вне модели формы, чтобы zod не «съедал» его при парсинге.
 */
export function useLeadSubmission<TValues extends FieldValues>({
  form,
  defaultValues,
  telegramFallback,
}: UseLeadSubmissionOptions<TValues>) {
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const startedAtRef = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const onSubmit = form.handleSubmit(async (data) => {
    setStatus("submitting");
    setError(undefined);

    // window.location.search читаем на клиенте в момент отправки, а не через
    // useSearchParams() — тот требует Suspense-границы для статически
    // генерируемых страниц (/product/[slug], /dev/forms).
    const utm: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (key.startsWith("utm_")) utm[key] = value;
    });

    const payload = {
      ...data,
      sourcePath: pathname,
      locale: "ru" as const,
      utm: Object.keys(utm).length > 0 ? utm : undefined,
      honeypot: honeypotRef.current?.value ?? "",
      startedAt: startedAtRef.current,
    };

    const result = await submitLead(payload);
    if (result.ok) {
      setStatus("success");
      form.reset(defaultValues);
    } else {
      setStatus("error");
      setError(result.error);
    }
  });

  return {
    status,
    error,
    onSubmit,
    honeypotRef,
    telegramHref: buildTelegramLink(telegramFallback),
    resetStatus: () => setStatus("idle"),
  };
}
