import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

export type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Визуальный размер. */
  level?: HeadingLevel;
  /** Семантический тег, если он должен отличаться от визуального уровня. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: "text-4xl md:text-5xl",
  2: "text-3xl md:text-4xl",
  3: "text-2xl md:text-3xl",
  4: "text-xl md:text-2xl",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level = 2, as, className, ...props }, ref) {
    const Comp = as ?? (`h${level}` as const);
    return (
      <Comp
        ref={ref}
        className={cn("font-heading text-ink-strong", sizeClasses[level], className)}
        {...props}
      />
    );
  },
);
