import Link from "next/link";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { getColors } from "@/lib/content/products";
import { ru } from "@/i18n/messages";

export function ColorGuideTeaser() {
  const colors = getColors();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-3xl text-ink-strong">{ru.home.colorGuide.heading}</h2>
        <p className="max-w-2xl text-base text-ink-muted">{ru.home.colorGuide.description}</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <ColorSwatch
            key={color.code}
            code={color.code}
            hex={color.hex}
            swatchImage={color.swatchImage}
            label={color.name.ru}
            showCode={false}
            tabIndex={-1}
            aria-hidden
          />
        ))}
      </div>
      <Link
        href="/guides/color-match"
        className="self-start text-sm font-medium text-ink underline-offset-4 hover:underline"
      >
        {ru.home.colorGuide.cta}
      </Link>
    </div>
  );
}
