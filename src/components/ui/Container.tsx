import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "./cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ as: Comp = "div", className, ...props }, ref) {
    return (
      <Comp
        ref={ref}
        className={cn("mx-auto w-full max-w-[1280px] px-4 md:px-8", className)}
        {...props}
      />
    );
  },
);
