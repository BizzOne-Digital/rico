import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PageHeroProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
  size?: "default" | "compact";
  image?: string;
  imageAlt?: string;
}

export function PageHero({
  children,
  className,
  align = "center",
  size = "default",
  image,
  imageAlt = "Fungtional Wellness",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "page-hero relative isolate overflow-hidden text-warm-white",
        !image && "bg-gradient-hero",
        size === "compact" && "page-hero-compact"
      )}
    >
      {image && (
        <div className="page-hero-bg" aria-hidden>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-obsidian/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/80 to-obsidian/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(85,200,120,0.1),transparent_60%)]" />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 mx-auto w-full min-w-0 max-w-full px-4 text-warm-white sm:px-6",
          align === "center" ? "max-w-4xl text-center" : "max-w-7xl",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
}
