"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { retailLeadSchema, type RetailLead } from "@/lib/leads/schema";
import { ru } from "@/i18n/messages";
import { CoreFields, HoneypotField, SubmitStatusPanel } from "./LeadFormBase";
import { useLeadSubmission } from "./use-lead-form";

export interface RetailLeadFormProps {
  productSlug?: string;
  variantId?: string;
  productTitle?: string;
  length?: number;
  colorName?: string;
  /** secondary — если на странице уже есть свой primary CTA (например, главная). */
  submitVariant?: "primary" | "secondary";
}

export function RetailLeadForm({
  productSlug,
  variantId,
  productTitle,
  length,
  colorName,
  submitVariant,
}: RetailLeadFormProps) {
  const defaultValues: RetailLead = {
    type: "retail",
    name: "",
    contact: "",
    channel: "telegram",
    comment: "",
    // consent обязан быть z.literal(true) в схеме, но по умолчанию не отмечен.
    consent: false as unknown as true,
    productSlug,
    variantId,
  };

  const form = useForm<RetailLead>({
    resolver: zodResolver(retailLeadSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { status, error, onSubmit, honeypotRef, telegramHref, resetStatus } = useLeadSubmission({
    form,
    defaultValues,
    telegramFallback: { productTitle, length, colorName },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <HoneypotField inputRef={honeypotRef} />
        <CoreFields />
        <SubmitStatusPanel
          status={status}
          error={error}
          telegramHref={telegramHref}
          onRetry={resetStatus}
          submitLabel={ru.forms.retail.submit}
          submitVariant={submitVariant}
        />
      </form>
    </FormProvider>
  );
}
