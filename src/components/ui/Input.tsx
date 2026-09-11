import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";
import { FieldShell, fieldControlClasses, fieldInvalidClasses } from "./field-shell";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, id, className, wrapperClassName, ...props },
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
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(fieldControlClasses, invalid && fieldInvalidClasses, className)}
          {...props}
        />
      )}
    </FieldShell>
  );
});
