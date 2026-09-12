import { getLocale } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { getTypedMessages } from "@/i18n/get-messages";
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

      <AccordionItem value="care">
        <AccordionTrigger>{ru.product.tabs.care}</AccordionTrigger>
        <AccordionContent>
          <p>{ru.product.careTodo}</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="delivery">
        <AccordionTrigger>{ru.product.tabs.delivery}</AccordionTrigger>
        <AccordionContent>
          <p>{ru.product.deliveryTodo}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
