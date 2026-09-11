import { useId, type ReactNode } from "react";
import { cn } from "./cn";

export interface FieldShellRenderProps {
  inputId: string;
  describedBy: string | undefined;
  invalid: boolean;
}

export interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  required?: boolean;
  className?: string;
  children: (renderProps: FieldShellRenderProps) => ReactNode;
}

/**
 * Общая обвязка label/hint/error для полей форм. Не экспортируется как
 * самостоятельный примитив — используется внутри Input/Textarea/Select.
 */
export function FieldShell({
  label,
  hint,
  error,
  id,
  required,
  className,
  children,
}: FieldShellProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="text-danger" aria-hidden>
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children({ inputId, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const fieldControlClasses = cn(
  "w-full rounded-base border border-border bg-bg px-3 py-2 text-base text-ink",
  "placeholder:text-ink-muted transition duration-200",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-strong",
  "disabled:opacity-50 disabled:pointer-events-none",
);

export const fieldInvalidClasses = "border-danger";
