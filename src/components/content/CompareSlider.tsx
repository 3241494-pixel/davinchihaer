"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/components/ui/cn";

export interface CompareSliderProps {
  /** Нижний слой справа от разделителя. */
  after: ReactNode;
  /** Верхний слой слева от разделителя, обрезается по его положению. */
  before: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  /** Подпись для скринридеров: что двигает разделитель. */
  sliderLabel: string;
  /** Один раз качнуть ручку при появлении на экране, подсказывая, что её можно двигать. */
  hint?: boolean;
  className?: string;
}

const START = 50;
const KEY_STEP = 5;
/** Сдвиг пальца в px, после которого понятно: тянут разделитель или листают страницу. */
const TOUCH_SLOP = 6;

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

/**
 * Сравнение «до/после» с разделителем: тянуть мышью или пальцем в любом месте
 * кадра, клавиатурой — стрелками на ручке. Вертикальная прокрутка на телефоне
 * не блокируется (touch-action: pan-y). При первом появлении на экране ручка
 * один раз качается, подсказывая, что её можно двигать; при reduced-motion — нет.
 */
export function CompareSlider({
  after,
  before,
  beforeLabel,
  afterLabel,
  sliderLabel,
  hint = true,
  className,
}: CompareSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  /** Начало касания, пока жест не распознан как горизонтальный; null — уже тянем. */
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState(START);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !hint) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setAnimating(true);
        [38, 62, START].forEach((value, index) => {
          timers.push(
            window.setTimeout(() => setPosition(value), 400 + index * 550),
          );
        });
        timers.push(
          window.setTimeout(() => setAnimating(false), 400 + 3 * 550),
        );
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [hint]);

  function positionFromPointer(clientX: number) {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  }

  // Мышью разделитель прыгает к месту клика. Пальцем — двигается только после
  // горизонтального сдвига, чтобы прокрутка страницы через слайдер его не сбивала.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    setAnimating(false);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === "touch") {
      touchStartRef.current = { x: event.clientX, y: event.clientY };
      return;
    }
    touchStartRef.current = null;
    positionFromPointer(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const start = touchStartRef.current;
    if (start) {
      const dx = Math.abs(event.clientX - start.x);
      const dy = Math.abs(event.clientY - start.y);
      if (dx < TOUCH_SLOP || dx < dy) return;
      touchStartRef.current = null;
    }
    positionFromPointer(event.clientX);
  }

  function stopDragging() {
    draggingRef.current = false;
    touchStartRef.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowLeft: position - KEY_STEP,
      ArrowDown: position - KEY_STEP,
      ArrowRight: position + KEY_STEP,
      ArrowUp: position + KEY_STEP,
      Home: 0,
      End: 100,
    };
    if (event.key in moves) {
      event.preventDefault();
      setAnimating(false);
      setPosition(clamp(moves[event.key]));
    }
  }

  const transition = animating ? "duration-500 ease-in-out" : "duration-0";

  return (
    <div
      ref={rootRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      className={cn(
        "relative aspect-[8/15] w-full cursor-ew-resize touch-pan-y overflow-hidden bg-surface-alt select-none",
        className,
      )}
    >
      <div className="absolute inset-0">{after}</div>
      <div
        className={cn("absolute inset-0 transition-[clip-path]", transition)}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {before}
      </div>

      <span className="caps pointer-events-none absolute bottom-4 left-4 bg-ink/70 px-3 py-2 text-bg">
        {beforeLabel}
      </span>
      <span className="caps pointer-events-none absolute right-4 bottom-4 bg-ink/70 px-3 py-2 text-bg">
        {afterLabel}
      </span>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-bg transition-[left]",
          transition,
        )}
        style={{ left: `${position}%` }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label={sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}%`}
        onKeyDown={handleKeyDown}
        className={cn(
          "absolute top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg text-ink shadow-lg transition-[left]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg",
          transition,
        )}
        style={{ left: `${position}%` }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
          aria-hidden
        >
          <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
        </svg>
      </div>
    </div>
  );
}
