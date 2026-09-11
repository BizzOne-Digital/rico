import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#143D2D] text-[#F5F3EC] border-[#2D6A4F]",
  success: "bg-[#55C878]/15 text-[#143D2D] border-[#55C878]/40",
  warning: "bg-[#F05A28]/10 text-[#F05A28] border-[#F05A28]/30",
  danger: "bg-[#F05A28]/15 text-[#080A09] border-[#F05A28]/40",
  neutral: "bg-[#EDE9DE] text-[#143D2D] border-[#C8C9C7]",
  outline: "bg-transparent text-[#143D2D] border-[#2D6A4F]",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
