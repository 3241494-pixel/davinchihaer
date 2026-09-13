"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { messengerTransport } from "@/lib/lead/transport";
import { buildLeadMessageText, type LeadMessageExtras, type LeadPayload } from "@/lib/lead/message";
import { trackLeadIntent } from "@/lib/analytics";

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";

/** Заполнение формы быстрее этого порога считается ботом. */
const MIN_SUBMIT_MS = 3000;

export interface UseLeadSubmissionOptions<TValues extends FieldValues> {
  form: UseFormReturn<TValues>;
  defaultValues: TValues;
  /** Данные для сообщения, не входящие в zod-схему формы (см. LeadMessageExtras). */
  messageExtras?: LeadMessageExtras;
}

/**
 * Общее ядро логики отправки заявки поверх уже созданного react-hook-form
 * инстанса (резолвер и схему конкретная форма настраивает сама — так проще
 * с типами zodResolver, чем прятать useForm внутри общего generic-хука).
 * honeypot держим вне модели формы, чтобы zod не «съедал» его при парсинге.
 *
 * Сервера нет (static export): «отправка» — это готовая ссылка в мессенджер
 * (см. lib/lead/transport.ts), которую мы открываем сами. Экран успеха
 * показывает и повторную ссылку, и текст на копирование — на случай, если
 * мессенджер не открылся (блокировка всплывающих окон и т.п.).
 */
export function useLeadSubmission<TValues extends FieldValues>({
  form,
  defaultValues,
  messageExtras,
}: UseLeadSubmissionOptions<TValues>) {
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const [resultUrl, setResultUrl] = useState<string | undefined>();
  const [resultText, setResultText] = useState<string | undefined>();
  const startedAtRef = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const locale = useLocale();

  const onSubmit = form.handleSubmit((data) => {
    setError(undefined);

    // Ловушка заполнена, или форма отправлена подозрительно быстро — тихо
    // «успех», чтобы не подсказывать боту, что его поймали, но мессенджер не открываем.
    if (honeypotRef.current?.value || Date.now() - startedAtRef.current < MIN_SUBMIT_MS) {
      setStatus("success");
      form.reset(defaultValues);
      return;
    }

    const utm: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (key.startsWith("utm_")) utm[key] = value;
    });

    // data приходит из react-hook-form как TValues (generic) — на рантайме это
    // всегда валидный по zod-схеме Lead конкретной формы, см. вызовы ниже.
    const payload = {
      ...data,
      ...messageExtras,
      sourcePath: pathname,
      locale,
      utm: Object.keys(utm).length > 0 ? utm : undefined,
      honeypot: "",
      startedAt: startedAtRef.current,
    } as unknown as LeadPayload;

    try {
      const result = messengerTransport.sendLead(payload);
      trackLeadIntent(payload.type, payload.channel);
      setResultUrl(result.url);
      setResultText(buildLeadMessageText(payload));
      window.open(result.url, "_blank", "noopener,noreferrer");
      setStatus("success");
      form.reset(defaultValues);
    } catch {
      setStatus("error");
      setError("Не удалось подготовить сообщение. Попробуйте ещё раз.");
    }
  });

  return {
    status,
    error,
    onSubmit,
    honeypotRef,
    resultUrl,
    resultText,
    resetStatus: () => setStatus("idle"),
  };
}
