import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "./cn";
import { IconCheck } from "./icons";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, error, id, className, required, ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 select-none has-disabled:cursor-not-allowed has-disabled:opacity-50"
        >
          <span className="relative inline-flex size-5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              required={required}
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={errorId}
              className={cn(
                "peer absolute inset-0 z-10 size-full cursor-pointer appearance-none disabled:cursor-not-allowed",
                className,
              )}
              {...props}
            />
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 rounded-base border border-border bg-bg transition-colors duration-200",
                "peer-checked:border-ink peer-checked:bg-ink",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-strong",
                error && "border-danger",
              )}
            />
            <IconCheck
              aria-hidden
              className="pointer-events-none absolute inset-0 m-auto size-3.5 text-bg opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
            />
          </span>
          {label && <span className="text-sm text-ink">{label}</span>}
        </label>
        {error && (
          <p id={errorId} role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
