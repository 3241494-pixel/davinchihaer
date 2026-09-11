import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
}

const paddingClasses: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = "md", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-base border border-border bg-surface",
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
});
