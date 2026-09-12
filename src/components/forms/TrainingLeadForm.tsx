"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { trainingLeadSchema, type TrainingLead } from "@/lib/leads/schema";
import { ru } from "@/i18n/messages";
import { CoreFields, HoneypotField, SubmitStatusPanel } from "./LeadFormBase";
import { useLeadSubmission } from "./use-lead-form";

export interface TrainingLeadFormProps {
  defaultFormat?: "online" | "offline";
  /** secondary — если на странице уже есть свой primary CTA. */
  submitVariant?: "primary" | "secondary";
}

export function TrainingLeadForm({ defaultFormat = "online", submitVariant }: TrainingLeadFormProps = {}) {
  const defaultValues: TrainingLead = {
    type: "training",
    name: "",
    contact: "",
    channel: "telegram",
    comment: "",
    // consent обязан быть z.literal(true) в схеме, но по умолчанию не отмечен.
    consent: false as unknown as true,
    format: defaultFormat,
    experience: "",
    preferredDates: "",
  };

  const form = useForm<TrainingLead>({
    resolver: zodResolver(trainingLeadSchema),
    defaultValues,
    mode: "onBlur",
  });

  const {
    register,
    formState: { errors },
  } = form;

  const { status, error, onSubmit, honeypotRef, telegramHref, resetStatus } = useLeadSubmission({
    form,
    defaultValues,
    telegramFallback: {},
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <HoneypotField inputRef={honeypotRef} />
        <CoreFields />
        <Select
          label={ru.forms.training.format}
          required
          defaultValue={defaultFormat}
          error={errors.format?.message}
          {...register("format")}
        >
          <option value="online">{ru.forms.training.formatOnline}</option>
          <option value="offline">{ru.forms.training.formatOffline}</option>
        </Select>
        <Textarea
          label={ru.forms.training.experience}
          required
          error={errors.experience?.message}
          {...register("experience")}
        />
        <Input
          label={ru.forms.training.preferredDates}
          error={errors.preferredDates?.message}
          {...register("preferredDates")}
        />
        <SubmitStatusPanel
          status={status}
          error={error}
          telegramHref={telegramHref}
          onRetry={resetStatus}
          submitLabel={ru.forms.training.submit}
          submitVariant={submitVariant}
        />
      </form>
    </FormProvider>
  );
}
