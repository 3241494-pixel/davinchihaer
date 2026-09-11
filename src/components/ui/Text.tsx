import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "./cn";

export type TextSize = "sm" | "base" | "lg";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: TextSize;
  muted?: boolean;
}

const sizeClasses: Record<TextSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Comp = "p", size = "base", muted = false, className, ...props },
  ref,
) {
  return (
    <Comp
      ref={ref}
      className={cn(sizeClasses[size], muted ? "text-ink-muted" : "text-ink", className)}
      {...props}
    />
  );
});
