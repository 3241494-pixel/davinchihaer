import Image from "next/image";
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cn } from "./cn";
import { IconCheck } from "./icons";

export type ColorSwatchShape = "circle" | "square";
export type ColorSwatchSize = "sm" | "md" | "lg";

export interface ColorSwatchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Код оттенка, например '6.0' — используется как подпись по умолчанию. */
  code: string;
  /** HEX цвета для отрисовки, когда нет фото пряди. */
  hex?: string;
  /** Фото пряди — приоритетнее hex. */
  swatchImage?: string;
  /** Название оттенка для подписи и aria-label; по умолчанию используется code. */
  label?: string;
  selected?: boolean;
  shape?: ColorSwatchShape;
  size?: ColorSwatchSize;
  showCode?: boolean;
}

const sizeClasses: Record<ColorSwatchSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(
  function ColorSwatch(
    {
      code,
      hex,
      swatchImage,
      label,
      selected = false,
      shape = "circle",
      size = "md",
      showCode = true,
      className,
      ...props
    },
    ref,
  ) {
    // hex приходит из данных оттенка и не сводится к конечному набору классов
    // Tailwind — инлайн-стиль здесь неизбежен.
    const style: CSSProperties | undefined =
      !swatchImage && hex ? { backgroundColor: hex } : undefined;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        aria-label={label ?? code}
        className={cn(
          "group inline-flex flex-col items-center gap-1.5 focus-visible:outline-none",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "relative inline-flex overflow-hidden border border-border transition-transform duration-200",
            shape === "circle" ? "rounded-full" : "rounded-base",
            sizeClasses[size],
            selected ? "scale-110 border-ink-strong" : "group-hover:scale-105",
            "group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink-strong",
          )}
          style={style}
        >
          {swatchImage && (
            <Image
              src={swatchImage}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          )}
          {selected && (
            <span className="absolute top-0 right-0 flex size-4 -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full bg-ink-strong text-bg">
              <IconCheck strokeWidth={3} className="size-2.5" />
            </span>
          )}
        </span>
        {showCode && (
          <span className="text-xs text-ink-muted">{label ?? code}</span>
        )}
      </button>
    );
  },
);
