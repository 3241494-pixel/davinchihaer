import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";
import { cn } from "./cn";
import { mergeRefs } from "./merge-refs";
import { IconSpinner } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Показывает спиннер и блокирует повторный клик. */
  loading?: boolean;
  /**
   * Рендерит переданный дочерний элемент (обычно `<a>`) вместо `<button>`,
   * перенося на него стили и обработчики. Для ссылок, оформленных как кнопка.
   */
  asChild?: boolean;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong";

const base = cn(
  "inline-flex items-center justify-center gap-2 font-sans font-medium",
  "transition duration-200 disabled:pointer-events-none disabled:opacity-50",
  focusRing,
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ink text-bg hover:bg-ink-strong",
  secondary: "border border-ink bg-transparent text-ink hover:bg-surface",
  ghost: "bg-transparent text-ink hover:bg-surface",
  link: "bg-transparent text-ink underline underline-offset-4 hover:text-ink-muted",
};

const sizeClasses: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { sm: "h-9 rounded-base px-3 text-sm", md: "h-11 rounded-base px-5 text-base", lg: "h-14 rounded-base px-8 text-lg" },
  secondary: { sm: "h-9 rounded-base px-3 text-sm", md: "h-11 rounded-base px-5 text-base", lg: "h-14 rounded-base px-8 text-lg" },
  ghost: { sm: "h-9 rounded-base px-3 text-sm", md: "h-11 rounded-base px-5 text-base", lg: "h-14 rounded-base px-8 text-lg" },
  link: { sm: "text-sm", md: "text-base", lg: "text-lg" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      asChild = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const classes = cn(
      base,
      variantClasses[variant],
      sizeClasses[variant][size],
      className,
    );
    const isDisabled = disabled || loading;

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<Record<string, unknown>>;
      const existingRef = (child as unknown as { ref?: React.Ref<unknown> }).ref;
      return cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className as string | undefined),
        "aria-disabled": isDisabled || undefined,
        ref: mergeRefs(ref, existingRef),
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <IconSpinner className="size-4" />}
        <span className={loading ? "opacity-70" : undefined}>{children}</span>
      </button>
    );
  },
);
