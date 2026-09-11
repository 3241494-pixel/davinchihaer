"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "./cn";
import { IconChevronDown } from "./icons";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`${component} должен использоваться внутри <Accordion>`);
  }
  return ctx;
}

interface ItemContextValue {
  value: string;
  triggerId: string;
  contentId: string;
}

const ItemContext = createContext<ItemContextValue | null>(null);

function useItemContext(component: string): ItemContextValue {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error(`${component} должен использоваться внутри <AccordionItem>`);
  }
  return ctx;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** single — открыт максимум один пункт; multiple — независимые пункты. */
  type?: AccordionType;
  defaultValue?: string | string[];
}

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openValues, setOpenValues] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  });

  const toggle = useCallback(
    (value: string) => {
      setOpenValues((prev) => {
        const next = new Set(prev);
        if (type === "single") {
          const wasOpen = next.has(value);
          next.clear();
          if (!wasOpen) next.add(value);
        } else if (next.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        return next;
      });
    },
    [type],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({ isOpen: (value) => openValues.has(value), toggle }),
    [openValues, toggle],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        data-accordion
        className={cn("flex flex-col divide-y divide-border border-y border-border", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, ...props }: AccordionItemProps) {
  const generatedId = useId();
  const itemContext = useMemo<ItemContextValue>(
    () => ({ value, triggerId: `${generatedId}-trigger`, contentId: `${generatedId}-content` }),
    [value, generatedId],
  );

  return (
    <ItemContext.Provider value={itemContext}>
      <div className={cn(className)} {...props} />
    </ItemContext.Provider>
  );
}

function focusSibling(current: HTMLButtonElement, key: string) {
  const root = current.closest("[data-accordion]");
  if (!root) return;
  const triggers = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]"),
  );
  const index = triggers.indexOf(current);
  let nextIndex = index;
  if (key === "ArrowDown") nextIndex = (index + 1) % triggers.length;
  else if (key === "ArrowUp") nextIndex = (index - 1 + triggers.length) % triggers.length;
  else if (key === "Home") nextIndex = 0;
  else if (key === "End") nextIndex = triggers.length - 1;
  triggers[nextIndex]?.focus();
}

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ className, children, onKeyDown, ...props }: AccordionTriggerProps) {
  const { value, triggerId, contentId } = useItemContext("AccordionTrigger");
  const { isOpen, toggle } = useAccordionContext("AccordionTrigger");
  const open = isOpen(value);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      focusSibling(event.currentTarget, event.key);
    }
  };

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      data-accordion-trigger
      onClick={() => toggle(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-base font-medium text-ink",
        "transition-colors duration-200 hover:text-ink-strong",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <IconChevronDown
        aria-hidden
        className={cn("size-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
      />
    </button>
  );
}

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { value, triggerId, contentId } = useItemContext("AccordionContent");
  const { isOpen } = useAccordionContext("AccordionContent");

  if (!isOpen(value)) return null;

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      className={cn("animate-fade-in pb-4 text-sm text-ink-muted", className)}
      {...props}
    >
      {children}
    </div>
  );
}
