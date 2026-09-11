import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedStyles = {
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({
  className,
  rounded = "md",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-gradient-to-r from-[#EDE9DE] via-[#F5F3EC] to-[#EDE9DE] bg-[length:200%_100%]",
        roundedStyles[rounded],
        className
      )}
      {...props}
    />
  );
}
