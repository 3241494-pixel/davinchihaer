"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  Checkbox,
  ColorSwatch,
  Container,
  Heading,
  Input,
  Modal,
  RadioGroup,
  Rating,
  Section,
  Select,
  Skeleton,
  Text,
  Textarea,
} from "@/components/ui";

const BUTTON_VARIANTS = ["primary", "secondary", "ghost", "link"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

function DemoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" muted>
        {label}
      </Text>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-border py-10 first:border-t-0 first:pt-0">
      <Heading level={2}>{title}</Heading>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

export default function DevUiPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("online");
  const [selectedColor, setSelectedColor] = useState("18");

  return (
    <Container as="main" className="py-16">
      <header className="mb-12 flex flex-col gap-2">
        <Heading level={1}>UI-примитивы</Heading>
        <Text muted>
          Служебная страница для приёмки. Каждый компонент показан во всех
          вариантах и состояниях: обычное, hover, disabled, loading, с
          ошибкой. Не часть каталога, удалится перед продакшеном.
        </Text>
      </header>

      <Block title="Button">
        {BUTTON_VARIANTS.map((variant) => (
          <DemoRow key={variant} label={`variant: ${variant}`}>
            {BUTTON_SIZES.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {size}
              </Button>
            ))}
          </DemoRow>
        ))}
        <DemoRow label="hover / focus-visible — попробуйте навести или Tab">
          <Button variant="primary">Наведите курсор</Button>
          <Button variant="secondary">Или нажмите Tab</Button>
        </DemoRow>
        <DemoRow label="disabled">
          <Button variant="primary" disabled>
            Primary
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </DemoRow>
        <DemoRow label="loading">
          <Button variant="primary" loading>
            Отправка
          </Button>
          <Button variant="secondary" loading>
            Отправка
          </Button>
        </DemoRow>
        <DemoRow label="asChild — рендерит переданную ссылку как кнопку">
          <Button asChild variant="primary">
            <a href="#dev-ui-anchor">Ссылка-кнопка</a>
          </Button>
        </DemoRow>
      </Block>

      <Block title="Input">
        <DemoRow label="обычное">
          <Input label="Имя" placeholder="Как вас зовут" className="max-w-xs" />
        </DemoRow>
        <DemoRow label="hover / focus-visible — кликните в поле">
          <Input label="Телефон" placeholder="+995" className="max-w-xs" />
        </DemoRow>
        <DemoRow label="disabled">
          <Input label="Промокод" defaultValue="недоступно" disabled className="max-w-xs" />
        </DemoRow>
        <DemoRow label="с ошибкой">
          <Input
            label="Email"
            defaultValue="not-an-email"
            error="Введите корректный email"
            className="max-w-xs"
          />
        </DemoRow>
        <DemoRow label="с подсказкой (hint)">
          <Input
            label="Telegram"
            hint="Например, @davinchi_hair"
            className="max-w-xs"
          />
        </DemoRow>
      </Block>

      <Block title="Textarea">
        <DemoRow label="обычное / disabled / с ошибкой">
          <Textarea label="Комментарий" placeholder="Расскажите подробнее" className="max-w-sm" />
          <Textarea label="Комментарий" defaultValue="Недоступно" disabled className="max-w-sm" />
          <Textarea
            label="Комментарий"
            error="Слишком длинный текст"
            defaultValue="……………………………………………"
            className="max-w-sm"
          />
        </DemoRow>
      </Block>

      <Block title="Select">
        <DemoRow label="обычное / disabled / с ошибкой">
          <Select label="Длина" className="max-w-48" defaultValue="60">
            <option value="40">40 см</option>
            <option value="50">50 см</option>
            <option value="60">60 см</option>
            <option value="70">70 см</option>
          </Select>
          <Select label="Длина" className="max-w-48" disabled defaultValue="60">
            <option value="60">60 см</option>
          </Select>
          <Select label="Длина" className="max-w-48" error="Выберите длину" defaultValue="">
            <option value="" disabled>
              Не выбрано
            </option>
            <option value="60">60 см</option>
          </Select>
        </DemoRow>
      </Block>

      <Block title="Checkbox">
        <DemoRow label="обычное — управляемое, кликните">
          <Checkbox
            label="Согласен с обработкой персональных данных"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
        </DemoRow>
        <DemoRow label="disabled: снят / отмечен">
          <Checkbox label="Недоступно, снят" disabled />
          <Checkbox label="Недоступно, отмечен" disabled defaultChecked />
        </DemoRow>
        <DemoRow label="с ошибкой">
          <Checkbox label="Нужно подтвердить согласие" error="Отметьте, чтобы продолжить" />
        </DemoRow>
      </Block>

      <Block title="RadioGroup">
        <DemoRow label="обычное — управляемое">
          <RadioGroup
            name="format"
            label="Формат обучения"
            value={radioValue}
            onChange={setRadioValue}
            orientation="horizontal"
            options={[
              { value: "online", label: "Онлайн" },
              { value: "offline", label: "Тбилиси" },
              { value: "unavailable", label: "Недоступно", disabled: true },
            ]}
          />
        </DemoRow>
        <DemoRow label="с ошибкой">
          <RadioGroup
            name="format-error"
            label="Формат обучения"
            error="Выберите один из форматов"
            options={[
              { value: "online", label: "Онлайн" },
              { value: "offline", label: "Тбилиси" },
            ]}
          />
        </DemoRow>
      </Block>

      <Block title="Badge">
        <DemoRow label="outline / solid — default">
          <Badge variant="outline">Новинка</Badge>
          <Badge variant="solid">Бестселлер</Badge>
        </DemoRow>
        <DemoRow label="danger — только ошибки и «нет в наличии»">
          <Badge variant="outline" tone="danger">
            Нет в наличии
          </Badge>
          <Badge variant="solid" tone="danger">
            Ошибка
          </Badge>
        </DemoRow>
      </Block>

      <Block title="Card">
        <DemoRow label="padding: sm / md / lg">
          <Card padding="sm">
            <Text size="sm">sm</Text>
          </Card>
          <Card padding="md">
            <Text size="sm">md</Text>
          </Card>
          <Card padding="lg">
            <Text size="sm">lg</Text>
          </Card>
        </DemoRow>
      </Block>

      <Block title="Accordion">
        <Text size="sm" muted>
          Клавиатура: Tab к заголовку, Enter/Space — раскрыть, стрелки
          вверх/вниз, Home/End — перейти между заголовками.
        </Text>
        <Accordion type="single" defaultValue="item-1" className="max-w-xl">
          <AccordionItem value="item-1">
            <AccordionTrigger>Как подобрать длину?</AccordionTrigger>
            <AccordionContent>
              Ориентируйтесь на собственную длину волос и желаемый результат —
              подробнее в гайде по подбору длины.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Сколько служит система?</AccordionTrigger>
            <AccordionContent>
              При правильной установке и уходе — от года и дольше, лента может
              переставляться повторно.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Можно ли скорректировать самостоятельно?</AccordionTrigger>
            <AccordionContent>
              Да, после того как вы освоите технику — достаточно необходимых
              материалов.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Block>

      <Block title="Modal / Dialog">
        <DemoRow label="фокус-трап, Esc закрывает, скролл страницы блокируется">
          <Button onClick={() => setModalOpen(true)}>Открыть модалку</Button>
        </DemoRow>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Подбор цвета"
          description="Заполните форму, и мы поможем подобрать оттенок."
        >
          <Input label="Имя" placeholder="Ваше имя" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => setModalOpen(false)}>Отправить</Button>
          </div>
        </Modal>
      </Block>

      <Block title="Container / Section">
        <Text size="sm" muted>
          Section поддерживает spacing (none/sm/md/lg) и tone (bg/surface/surface-alt).
        </Text>
        <div className="flex flex-col gap-2 border border-border">
          <Section spacing="sm" tone="surface">
            <Text size="sm">spacing=sm, tone=surface</Text>
          </Section>
          <Section spacing="md" tone="surface-alt">
            <Text size="sm">spacing=md, tone=surface-alt</Text>
          </Section>
        </div>
      </Block>

      <Block title="Heading">
        <div className="flex flex-col gap-3">
          <Heading level={1}>Heading level 1</Heading>
          <Heading level={2}>Heading level 2</Heading>
          <Heading level={3}>Heading level 3</Heading>
          <Heading level={4}>Heading level 4</Heading>
        </div>
      </Block>

      <Block title="Text">
        <div className="flex flex-col gap-2">
          <Text size="lg">Text size lg</Text>
          <Text size="base">Text size base</Text>
          <Text size="sm">Text size sm</Text>
          <Text muted>Text приглушённый (muted)</Text>
        </div>
      </Block>

      <Block title="ColorSwatch">
        <DemoRow label="круг — выбранное состояние управляемое, кликните">
          <ColorSwatch
            code="6"
            hex="#6B4226"
            label="Каштановый"
            selected={selectedColor === "6"}
            onClick={() => setSelectedColor("6")}
          />
          <ColorSwatch
            code="18"
            hex="#C7A06A"
            label="Пепельный блонд"
            selected={selectedColor === "18"}
            onClick={() => setSelectedColor("18")}
          />
          <ColorSwatch
            code="613"
            hex="#F2E2B8"
            label="Экстра светлый"
            selected={selectedColor === "613"}
            onClick={() => setSelectedColor("613")}
          />
          <ColorSwatch
            code="99j"
            hex="#6E2430"
            label="Бордовый"
            selected={selectedColor === "99j"}
            onClick={() => setSelectedColor("99j")}
          />
        </DemoRow>
        <DemoRow label="квадрат, без подписи">
          <ColorSwatch code="1" hex="#1B1710" shape="square" showCode={false} />
          <ColorSwatch code="grey-silver" hex="#B8B8B8" shape="square" showCode={false} />
        </DemoRow>
      </Block>

      <Block title="Rating">
        <DemoRow label="0 / 2.5 / 3 / 4.5 / 5 из 5">
          <Rating value={0} />
          <Rating value={2.5} />
          <Rating value={3} />
          <Rating value={4.5} />
          <Rating value={5} />
        </DemoRow>
      </Block>

      <Block title="Skeleton">
        <DemoRow label="текстовые строки">
          <div className="flex w-64 flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </DemoRow>
        <DemoRow label="круг + блок (аватар / фото товара)">
          <Skeleton circle className="size-12" />
          <Skeleton className="h-24 w-32" />
        </DemoRow>
      </Block>
    </Container>
  );
}
