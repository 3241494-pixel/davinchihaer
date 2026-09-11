import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "./cn";

export type SectionSpacing = "sm" | "md" | "lg" | "none";
export type SectionTone = "bg" | "surface" | "surface-alt";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  spacing?: SectionSpacing;
  tone?: SectionTone;
}

const spacingClasses: Record<SectionSpacing, string> = {
  none: "",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
};

const toneClasses: Record<SectionTone, string> = {
  bg: "bg-bg",
  surface: "bg-surface",
  "surface-alt": "bg-surface-alt",
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { as: Comp = "section", spacing = "md", tone = "bg", className, ...props },
  ref,
) {
  return (
    <Comp
      ref={ref}
      className={cn(spacingClasses[spacing], toneClasses[tone], className)}
      {...props}
    />
  );
});
