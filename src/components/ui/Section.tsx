"use client";

import { forwardRef, useEffect, useRef, useState, type ElementType, type HTMLAttributes } from "react";
import { cn } from "./cn";
import { mergeRefs } from "./merge-refs";

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

/** Каждая секция страницы проявляется при попадании во вьюпорт — см. .reveal в globals.css. */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { as: Comp = "section", spacing = "md", tone = "bg", className, ...props },
  forwardedRef,
) {
  const localRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = localRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Comp
      ref={mergeRefs(forwardedRef, localRef)}
      className={cn(
        "reveal",
        visible && "is-visible",
        spacingClasses[spacing],
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
});
