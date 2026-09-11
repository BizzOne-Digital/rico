import { DEFAULT_ANNOUNCEMENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface AnnouncementBarProps {
  announcement?: string;
  className?: string;
}

export function AnnouncementBar({
  announcement = DEFAULT_ANNOUNCEMENT,
  className,
}: AnnouncementBarProps) {
  if (!announcement?.trim()) return null;

  const text = announcement
    .replace(/•/g, "•")
    .toUpperCase();

  return (
    <div
      className={cn(
        "bg-[#0a0c0b] text-center text-warm-white",
        className
      )}
      role="region"
      aria-label="Site announcement"
    >
      <p className="px-3 py-2 text-[9px] font-medium leading-relaxed tracking-[0.1em] break-words sm:px-4 sm:py-2.5 sm:text-[10px] sm:tracking-[0.18em] md:text-[11px] md:tracking-[0.22em]">
        {text}
      </p>
    </div>
  );
}
