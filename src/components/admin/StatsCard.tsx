import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#2D6A4F]/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#2D6A4F]">
            {title}
          </p>
          <p className="text-2xl font-semibold text-[#143D2D]">{value}</p>
          {subtitle ? (
            <p className="text-xs text-[#C8C9C7]">{subtitle}</p>
          ) : null}
          {trend ? (
            <p className="text-xs font-medium text-[#55C878]">{trend}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#143D2D] text-[#55C878]">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
