"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type FloatingVariant = "mushroom" | "leaf" | "spore" | "capsule";

type FloatingElementsProps = {
  count?: number;
  variants?: FloatingVariant[];
  className?: string;
};

function MushroomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <ellipse cx="24" cy="30" rx="8" ry="10" fill={COLORS.softIvory ?? "#EDE9DE"} opacity="0.9" />
      <path
        d="M8 28C8 16 16 10 24 10C32 10 40 16 40 28"
        fill={COLORS.botanical}
        opacity="0.85"
      />
      <circle cx="18" cy="20" r="2" fill={COLORS.electric} opacity="0.5" />
      <circle cx="28" cy="16" r="1.5" fill={COLORS.electric} opacity="0.4" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path
        d="M20 4C12 12 8 22 10 32C18 28 28 22 30 10C26 8 22 6 20 4Z"
        fill={COLORS.deepForest}
        opacity="0.7"
      />
      <path d="M20 8V30" stroke={COLORS.electric} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function SporeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="6" fill={COLORS.metallicSilver} opacity="0.35" />
      <circle cx="12" cy="12" r="3" fill={COLORS.electric} opacity="0.25" />
    </svg>
  );
}

function CapsuleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 48" fill="none" className={className} aria-hidden>
      <rect x="6" y="8" width="20" height="32" rx="10" fill={COLORS.burntOrange} opacity="0.5" />
      <rect x="6" y="8" width="20" height="14" rx="10" fill={COLORS.deepForest} opacity="0.6" />
    </svg>
  );
}

const iconMap: Record<FloatingVariant, typeof MushroomIcon> = {
  mushroom: MushroomIcon,
  leaf: LeafIcon,
  spore: SporeIcon,
  capsule: CapsuleIcon,
};

const defaultPositions = [
  { top: "12%", left: "8%", size: 40 },
  { top: "22%", right: "10%", size: 32 },
  { top: "55%", left: "15%", size: 28 },
  { top: "68%", right: "18%", size: 36 },
  { top: "40%", left: "75%", size: 24 },
  { top: "80%", left: "45%", size: 20 },
];

export function FloatingElements({
  count = 4,
  variants = ["mushroom", "leaf", "spore", "capsule"],
  className,
}: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const items = defaultPositions.slice(0, count).map((pos, i) => ({
    ...pos,
    variant: variants[i % variants.length],
    delay: i * 0.4,
  }));

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-float]");

      elements.forEach((el, index) => {
        const yAmount = isMobile ? 8 : 16;
        const duration = isMobile ? 3 + index * 0.3 : 4 + index * 0.5;

        gsap.to(el, {
          y: `random(-${yAmount}, ${yAmount})`,
          x: `random(-${yAmount * 0.5}, ${yAmount * 0.5})`,
          rotation: `random(-6, 6)`,
          duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: parseFloat(el.dataset.delay ?? "0"),
        });
      });
    },
    { scope: containerRef, dependencies: [count, reducedMotion] }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {items.map((item, index) => {
        const Icon = iconMap[item.variant];
        const style: CSSProperties = {
          top: item.top,
          left: item.left,
          right: item.right,
          width: item.size,
          height: item.size,
        };

        return (
          <div
            key={index}
            data-float
            data-delay={String(item.delay)}
            className="absolute opacity-60"
            style={style}
          >
            <Icon className="h-full w-full" />
          </div>
        );
      })}
    </div>
  );
}
