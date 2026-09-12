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
      <h2 className="font-heading text-3xl text-ink-strong">{ru.academy.hub.faqHeading}</h2>
      <Accordion type="single" className="max-w-2xl">
        {ru.academy.hub.faq.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
