import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RetailLeadForm } from "@/components/forms/RetailLeadForm";
import { WholesaleLeadForm } from "@/components/forms/WholesaleLeadForm";
import { TrainingLeadForm } from "@/components/forms/TrainingLeadForm";

export default function DevFormsPage() {
  return (
    <Container className="flex flex-col gap-16 py-16">
      <header className="flex flex-col gap-2">
        <Heading level={1}>Формы заявок</Heading>
        <Text muted>
          Служебная страница для проверки трёх типов заявок и маршрутизации по темам
          Telegram-супергруппы. Не часть каталога, удалится перед продакшеном.
        </Text>
      </header>

      <section className="flex max-w-md flex-col gap-4">
        <Heading level={2}>Розница</Heading>
        <RetailLeadForm
          productSlug="tape-classic-slavic"
          variantId="tape-classic-slavic-40-18"
          productTitle="Классическое Tape-In, славянские волосы"
          length={40}
          colorName="Пепельный блонд"
        />
      </section>

      <section className="flex max-w-md flex-col gap-4">
        <Heading level={2}>Опт</Heading>
        <WholesaleLeadForm />
      </section>

      <section className="flex max-w-md flex-col gap-4">
        <Heading level={2}>Обучение</Heading>
        <TrainingLeadForm />
      </section>
    </Container>
  );
}
