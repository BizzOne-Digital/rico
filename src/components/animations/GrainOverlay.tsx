"use client";

import { cn } from "@/lib/utils";

type GrainOverlayProps = {
  className?: string;
  opacity?: number;
};

export function GrainOverlay({ className, opacity = 0.04 }: GrainOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-[9998] h-full w-full max-w-full", className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
      }}
    />
  );
}
