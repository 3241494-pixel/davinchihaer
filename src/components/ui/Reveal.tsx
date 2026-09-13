"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Задержка старта анимации, мс — для мягкого каскада в сетках и списках. */
  delayMs?: number;
}

/**
 * Проявление блока при попадании во вьюпорт (см. globals.css, класс .reveal).
 * Срабатывает один раз — после появления наблюдатель отключается, повторный
 * скролл вверх/вниз ничего не переигрывает. Под prefers-reduced-motion стили
 * .reveal вообще не применяются (см. globals.css), поэтому там эффекта нет.
 */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
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
    <div
      ref={localRef}
      className={cn("reveal", visible && "is-visible", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
