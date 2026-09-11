"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealDirection = "left" | "right" | "top" | "bottom";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
};

const directionMap: Record<RevealDirection, { x: number; y: number }> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
};

export function ScrollReveal({
  children,
  direction = "bottom",
  delay = 0,
  duration,
  distance,
  className,
  style,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reducedMotion) {
        if (ref.current) gsap.set(ref.current, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const offset = distance ?? (isMobile ? 24 : 48);
      const animDuration = duration ?? (isMobile ? 0.5 : 0.8);
      const vector = directionMap[direction];

      gsap.fromTo(
        ref.current,
        {
          autoAlpha: 0,
          x: vector.x * offset,
          y: vector.y * offset,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: animDuration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    },
    { scope: ref, dependencies: [direction, delay, duration, distance, once, reducedMotion] }
  );

  return (
    <div ref={ref} className={cn(className)} style={style}>
      {children}
    </div>
  );
}
