"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  label?: string;
};

export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration,
  className,
  label,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;

      const obj = { val: 0 };

      const format = (n: number) =>
        `${prefix}${n.toFixed(decimals)}${suffix}`;

      if (reducedMotion) {
        ref.current.textContent = format(value);
        return;
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const animDuration = duration ?? (isMobile ? 1.2 : 2);

      gsap.to(obj, {
        val: value,
        duration: animDuration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = format(obj.val);
          }
        },
      });
    },
    { scope: ref, dependencies: [value, suffix, prefix, decimals, duration, reducedMotion] }
  );

  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span ref={ref} className="tabular-nums">
        {prefix}0{suffix}
      </span>
      {label && (
        <span className="mt-1 text-sm uppercase tracking-widest opacity-70">
          {label}
        </span>
      )}
    </span>
  );
}
