import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";
import { FieldShell, fieldControlClasses, fieldInvalidClasses } from "./field-shell";
import { IconChevronDown } from "./icons";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, required, id, className, wrapperClassName, children, ...props },
  ref,
) {
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      id={id}
      required={required}
      className={wrapperClassName}
    >
      {({ inputId, describedBy, invalid }) => (
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              fieldControlClasses,
              "appearance-none pr-9",
              invalid && fieldInvalidClasses,
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted" />
        </div>
      )}
    </FieldShell>
  );
});
