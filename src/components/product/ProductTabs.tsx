import { getLocale } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { getTypedMessages } from "@/i18n/get-messages";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/content/locale";
import { SpecsTable } from "./SpecsTable";
import type { Product } from "@/lib/content/types";

export async function ProductTabs({ product }: { product: Product }) {
  const ru = await getTypedMessages();
  const locale = await getLocale();
  const description = pickLocale(product.description, locale).split("\n\n");

  return (
    <Accordion type="single" defaultValue="description">
      <AccordionItem value="description">
        <AccordionTrigger>{ru.product.tabs.description}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-3">
            {description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="specs">
        <AccordionTrigger>{ru.product.tabs.specs}</AccordionTrigger>
        <AccordionContent>
          <SpecsTable />
        </AccordionContent>
      </AccordionItem>

      {product.kind === "hair" && (
        <AccordionItem value="care">
          <AccordionTrigger>{ru.product.tabs.care}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-3">
              <ol className="flex list-decimal flex-col gap-2 pl-5">
                {ru.pages.care.rules.map((rule) => (
                  <li key={rule} className="pl-1">
                    {rule}
                  </li>
                ))}
              </ol>
              <Link
                href="/care"
                className="self-start text-ink underline underline-offset-4 hover:text-ink-muted"
              >
                {ru.product.careLink}
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="delivery">
        <AccordionTrigger>{ru.product.tabs.delivery}</AccordionTrigger>
        <AccordionContent>
          <p>{ru.product.deliveryTodo}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
