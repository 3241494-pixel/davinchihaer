import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { getColors } from "@/lib/content/products";
import { pickLocale } from "@/lib/content/locale";
import { getTypedMessages } from "@/i18n/get-messages";

export async function ColorGuideTeaser() {
  const ru = await getTypedMessages();
  const locale = await getLocale();
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
            label={pickLocale(color.name, locale)}
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
