const COLORS = [
  { name: "--color-bg", label: "bg", className: "bg-bg" },
  { name: "--color-surface", label: "surface", className: "bg-surface" },
  {
    name: "--color-surface-alt",
    label: "surface-alt",
    className: "bg-surface-alt",
  },
  { name: "--color-ink", label: "ink", className: "bg-ink" },
  {
    name: "--color-ink-strong",
    label: "ink-strong",
    className: "bg-ink-strong",
  },
  {
    name: "--color-ink-muted",
    label: "ink-muted",
    className: "bg-ink-muted",
  },
  { name: "--color-border", label: "border", className: "bg-border" },
  {
    name: "--color-danger",
    label: "danger (только ошибки/нет в наличии)",
    className: "bg-danger",
  },
] as const;

export default function TokensPage() {
  return (
    <main className="space-y-16 py-16">
      <header>
        <h1 className="font-heading text-4xl text-ink-strong">
          Дизайн-токены
        </h1>
        <p className="mt-2 text-ink-muted">
          Служебная страница для проверки токенов. Не часть каталога, будет
          удалена перед продакшеном.
        </p>
      </header>

      <section>
        <h2 className="font-heading text-2xl text-ink-strong">Цвета</h2>
        <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {COLORS.map((color) => (
            <li key={color.name} className="flex flex-col gap-2">
              <div
                className={`h-20 w-full rounded-[var(--radius-base)] border border-border ${color.className}`}
              />
              <div className="text-sm">
                <p className="text-ink">{color.label}</p>
                <p className="text-ink-muted">{color.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-heading text-2xl text-ink-strong">
          Шкала заголовков
        </h2>
        <div className="mt-6 space-y-4">
          <h1 className="font-heading text-5xl text-ink-strong">
            H1 Da Vinchi Hair
          </h1>
          <h2 className="font-heading text-4xl text-ink-strong">
            H2 Da Vinchi Hair
          </h2>
          <h3 className="font-heading text-3xl text-ink-strong">
            H3 Da Vinchi Hair
          </h3>
          <h4 className="font-heading text-2xl text-ink-strong">
            H4 Da Vinchi Hair
          </h4>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl text-ink-strong">
          Основной текст
        </h2>
        <p className="mt-6 max-w-prose text-base text-ink">
          Da Vinchi Hair — качественные волосы и ленточные системы для
          наращивания Tape-In. Один раз выбираете материалы — и получаете
          систему, которой пользуетесь снова и снова, при правильной установке
          и уходе.
        </p>
      </section>
    </main>
  );
}
