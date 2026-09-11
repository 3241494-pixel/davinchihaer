import { useId } from "react";
import { cn } from "./cn";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  defaultValue,
  onChange,
  error,
  required,
  className,
  orientation = "vertical",
}: RadioGroupProps) {
  const generatedId = useId();
  const errorId = error ? `${generatedId}-error` : undefined;

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      {label && (
        <legend className="mb-0.5 text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="text-danger" aria-hidden>
              {" "}
              *
            </span>
          )}
        </legend>
      )}
      <div
        className={cn(
          "flex gap-3",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
        role="radiogroup"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={errorId}
      >
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="inline-flex cursor-pointer items-center gap-2 select-none has-disabled:cursor-not-allowed has-disabled:opacity-50"
            >
              <span className="relative inline-flex size-5 shrink-0">
                <input
                  type="radio"
                  id={optionId}
                  name={name}
                  value={option.value}
                  disabled={option.disabled}
                  checked={value !== undefined ? value === option.value : undefined}
                  defaultChecked={
                    value === undefined && defaultValue !== undefined
                      ? defaultValue === option.value
                      : undefined
                  }
                  onChange={() => onChange?.(option.value)}
                  className="peer absolute inset-0 z-10 size-full cursor-pointer appearance-none disabled:cursor-not-allowed"
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 rounded-full border border-border bg-bg transition-colors duration-200",
                    "peer-checked:border-ink",
                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-strong",
                    error && "border-danger",
                  )}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 m-auto size-2.5 scale-0 rounded-full bg-ink transition-transform duration-200 peer-checked:scale-100"
                />
              </span>
              <span className="text-sm text-ink">{option.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
