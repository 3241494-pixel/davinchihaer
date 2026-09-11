import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Круглая форма для аватаров/свотчей вместо базового скругления. */
  circle?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { circle = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "animate-pulse bg-surface-alt",
        circle ? "rounded-full" : "rounded-base",
        className,
      )}
      {...props}
    />
  );
});
