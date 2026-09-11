import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";
import { IconStarFull, IconStarHalf, IconStarOutline } from "./icons";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Значение от 0 до max, может быть дробным — округляется до половины звезды. */
  value: number;
  max?: number;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
};

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  { value, max = 5, size = "md", className, ...props },
  ref,
) {
  const clamped = Math.min(Math.max(value, 0), max);
  const stars = Array.from({ length: max }, (_, index) => {
    const diff = clamped - index;
    if (diff >= 1) return "full" as const;
    if (diff >= 0.5) return "half" as const;
    return "empty" as const;
  });

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Оценка ${clamped} из ${max}`}
      className={cn("inline-flex items-center gap-0.5 text-ink-strong", className)}
      {...props}
    >
      {stars.map((star, index) => {
        const Icon =
          star === "full" ? IconStarFull : star === "half" ? IconStarHalf : IconStarOutline;
        return (
          <Icon
            key={index}
            aria-hidden
            className={cn(sizeClasses[size], star === "empty" && "text-border")}
          />
        );
      })}
    </div>
  );
});
