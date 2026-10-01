import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { getAttachments } from "@/lib/content/products";
import { getTypedMessages } from "@/i18n/get-messages";

export async function Assortment() {
  const ru = await getTypedMessages();
  const attachments = getAttachments();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-3xl text-ink-strong">{ru.wholesale.assortment.heading}</h2>
        <p className="max-w-2xl text-base text-ink-muted">{ru.wholesale.assortment.description}</p>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {attachments.map((attachment) => (
          <Link key={attachment} href={`/catalog/hair?attachment=${attachment}`}>
            <Card className="h-full text-center transition-colors duration-200 hover:border-ink-strong">
              <span className="font-heading text-lg text-ink-strong">{ru.attachments[attachment]}</span>
            </Card>
          </Link>
        ))}
        <Link href="/catalog/materials">
          <Card className="h-full text-center transition-colors duration-200 hover:border-ink-strong">
            <span className="font-heading text-lg text-ink-strong">{ru.catalogSections.materials}</span>
          </Card>
        </Link>
      </div>
      <Link
        href="/catalog"
        className="self-start text-sm font-medium text-ink underline-offset-4 hover:underline"
      >
        {ru.wholesale.assortment.cta}
      </Link>
    </div>
  );
}
