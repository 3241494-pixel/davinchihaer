"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { wholesaleLeadSchema, type WholesaleLead } from "@/lib/leads/schema";
import { ru } from "@/i18n/messages";
import { CoreFields, HoneypotField, SubmitStatusPanel } from "./LeadFormBase";
import { useLeadSubmission } from "./use-lead-form";

const defaultValues: WholesaleLead = {
  type: "wholesale",
  name: "",
  contact: "",
  channel: "telegram",
  comment: "",
  // consent обязан быть z.literal(true) в схеме, но по умолчанию не отмечен.
  consent: false as unknown as true,
  salonName: "",
  city: "",
  experience: "",
  estimatedVolume: "",
};

export function WholesaleLeadForm() {
  const form = useForm<WholesaleLead>({
    resolver: zodResolver(wholesaleLeadSchema),
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
        <Input
          label={ru.forms.wholesale.salonName}
          error={errors.salonName?.message}
          {...register("salonName")}
        />
        <Input
          label={ru.forms.wholesale.city}
          required
          error={errors.city?.message}
          {...register("city")}
        />
        <Textarea
          label={ru.forms.wholesale.experience}
          required
          error={errors.experience?.message}
          {...register("experience")}
        />
        <Input
          label={ru.forms.wholesale.estimatedVolume}
          error={errors.estimatedVolume?.message}
          {...register("estimatedVolume")}
        />
        <SubmitStatusPanel
          status={status}
          error={error}
          telegramHref={telegramHref}
          onRetry={resetStatus}
          submitLabel={ru.forms.wholesale.submit}
        />
      </form>
    </FormProvider>
  );
}
