import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface SplitImageSectionProps {
  image: string;
  alt: string;
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  dark?: boolean;
}

export function SplitImageSection({
  image,
  alt,
  children,
  reverse = false,
  className,
  dark = false,
}: SplitImageSectionProps) {
  return (
    <section
      className={cn(
        "section-spacing",
        dark ? "bg-obsidian text-warm-white" : "bg-carbon text-warm-white",
        className
      )}
    >
      <div className="mx-auto grid w-full min-w-0 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <div className={cn("relative min-w-0 overflow-hidden", reverse && "lg:order-2")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(8,10,9,0.2)]">
            <Image src={image} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 to-transparent" />
          </div>
          <div className="absolute -bottom-3 -right-3 hidden h-24 w-24 rounded-full border border-electric/30 bg-electric/10 blur-xl sm:block" aria-hidden />
        </div>
        <div className={cn("min-w-0 content-on-dark", reverse && "lg:order-1")}>{children}</div>
      </div>
    </section>
  );
}
