"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useFormContext, type FieldError } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { useTypedMessages } from "@/i18n/use-messages";
import type { LeadFormStatus } from "./use-lead-form";

interface CoreFormValues {
  name: string;
  contact: string;
  channel: "telegram" | "whatsapp" | "phone";
  comment?: string;
  consent: boolean;
}

function messageOf(error: FieldError | undefined): string | undefined {
  return error?.message;
}

/** Общие поля ядра заявки — используются внутри всех трёх форм. */
export function CoreFields() {
  const ru = useTypedMessages();
  const {
    register,
    formState: { errors },
  } = useFormContext<CoreFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={ru.forms.core.name}
        required
        autoComplete="name"
        error={messageOf(errors.name)}
        {...register("name")}
      />
      <Input
        label={ru.forms.core.contact}
        required
        placeholder={ru.forms.core.contactPlaceholder}
        hint={ru.forms.core.contactHint}
        autoComplete="tel"
        error={messageOf(errors.contact)}
        {...register("contact")}
      />
      <Select
        label={ru.forms.core.channel}
        required
        defaultValue="telegram"
        error={messageOf(errors.channel)}
        {...register("channel")}
      >
        <option value="telegram">{ru.forms.core.channelTelegram}</option>
        <option value="whatsapp">{ru.forms.core.channelWhatsapp}</option>
        <option value="phone">{ru.forms.core.channelPhone}</option>
      </Select>
      <Textarea
        label={ru.forms.core.comment}
        error={messageOf(errors.comment)}
        {...register("comment")}
      />
      <div className="flex flex-col gap-1">
        <Checkbox
          label={ru.forms.core.consentLabel}
          error={messageOf(errors.consent)}
          {...register("consent")}
        />
        <p className="pl-7 text-xs text-ink-muted">
          {ru.forms.core.consentLinkPrefix}{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            {ru.forms.core.consentLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Скрытая от людей ловушка для ботов — вне модели react-hook-form. */
export function HoneypotField({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <input
      ref={inputRef}
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
    />
  );
}

export interface SubmitStatusPanelProps {
  status: LeadFormStatus;
  error?: string;
  /** Готовая ссылка в мессенджер с текстом заявки (см. lib/lead/transport). */
  resultUrl?: string;
  /** Тот же текст в чистом виде — для кнопки «скопировать». */
  resultText?: string;
  onRetry: () => void;
  submitLabel: string;
  /** По умолчанию primary — форма обычно единственный CTA на странице. */
  submitVariant?: "primary" | "secondary";
}

export function SubmitStatusPanel({
  status,
  error,
  resultUrl,
  resultText,
  onRetry,
  submitLabel,
  submitVariant = "primary",
}: SubmitStatusPanelProps) {
  const ru = useTypedMessages();
  const [copied, setCopied] = useState(false);

  async function copyText() {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Буфер обмена недоступен (нет разрешения/небезопасный контекст) — тихо игнорируем,
      // ссылка на мессенджер остаётся основным путём.
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-3 rounded-base border border-border bg-surface p-4">
        <p className="font-medium text-ink-strong">{ru.forms.status.successTitle}</p>
        <p className="text-sm text-ink-muted">{ru.forms.status.successDescription}</p>
        <div className="flex flex-wrap gap-2">
          {resultUrl && (
            <Button asChild variant="secondary" size="sm" className="self-start">
              <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                {ru.forms.status.successOpenCta}
              </a>
            </Button>
          )}
          {resultText && (
            <Button variant="ghost" size="sm" className="self-start" onClick={copyText}>
              {copied ? ru.forms.status.copied : ru.forms.status.copyText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {status === "error" && (
        <div className="flex flex-col gap-2 rounded-base border border-danger px-4 py-3">
          <p className="text-sm font-medium text-danger">{ru.forms.status.errorTitle}</p>
          {error && <p className="text-sm text-ink-muted">{error}</p>}
          <Button variant="ghost" size="sm" onClick={onRetry} className="self-start">
            {ru.forms.status.retry}
          </Button>
        </div>
      )}
      <Button type="submit" variant={submitVariant} loading={status === "submitting"} size="lg">
        {submitLabel}
      </Button>
    </div>
  );
}
