import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { ru } from "@/i18n/messages";

export function FaqSection() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-3xl text-ink-strong">{ru.home.faq.heading}</h2>
      <Accordion type="single" className="max-w-2xl">
        {ru.home.faq.items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link
        href="/faq"
        className="self-start text-sm font-medium text-ink underline-offset-4 hover:underline"
      >
        {ru.home.faq.cta}
      </Link>
    </div>
  );
}
