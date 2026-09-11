import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "./cn";
import { FieldShell, fieldControlClasses, fieldInvalidClasses } from "./field-shell";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, hint, error, required, id, className, wrapperClassName, rows = 4, ...props },
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
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(fieldControlClasses, "resize-y", invalid && fieldInvalidClasses, className)}
            {...props}
          />
        )}
      </FieldShell>
    );
  },
);
