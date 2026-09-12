import { WholesaleLeadForm } from "@/components/forms/WholesaleLeadForm";
import { getTypedMessages } from "@/i18n/get-messages";

export async function WholesaleFormSection() {
  const ru = await getTypedMessages();
  return (
    <div id="lead-form" className="flex scroll-mt-24 flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.wholesale.contact.formHeading}</h2>
      <div className="max-w-xl">
        <WholesaleLeadForm submitVariant="secondary" />
      </div>
    </div>
  );
}
