import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeVariant = "outline" | "solid";
export type BadgeTone = "default" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
}

const variantToneClasses: Record<BadgeVariant, Record<BadgeTone, string>> = {
  outline: {
    default: "border border-ink text-ink bg-transparent",
    danger: "border border-danger text-danger bg-transparent",
  },
  solid: {
    default: "border border-ink-strong bg-ink-strong text-bg",
    danger: "border border-danger bg-danger text-bg",
  },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "outline", tone = "default", className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-base px-2 py-0.5 text-xs font-medium tracking-wide uppercase",
        variantToneClasses[variant][tone],
        className,
      )}
      {...props}
    />
  );
});
