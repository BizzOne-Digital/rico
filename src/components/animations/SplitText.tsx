"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SplitMode = "chars" | "words" | "lines";

type SplitTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  mode?: SplitMode;
  className?: string;
  stagger?: number;
  trigger?: boolean;
};

export function SplitText({
  children,
  as = "h2",
  mode = "words",
  className,
  stagger,
  trigger = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const segments =
    mode === "chars"
      ? children.split("")
      : mode === "lines"
        ? children.split("\n")
        : children.split(" ");

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const units = containerRef.current.querySelectorAll<HTMLElement>("[data-split-unit]");

      if (reducedMotion) {
        gsap.set(units, { y: "0%", autoAlpha: 1 });
        return;
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const staggerAmount = stagger ?? (isMobile ? 0.03 : 0.06);

      gsap.set(units, { y: "110%", autoAlpha: 0 });

      const animation: gsap.TweenVars = {
        y: "0%",
        autoAlpha: 1,
        duration: isMobile ? 0.45 : 0.65,
        stagger: staggerAmount,
        ease: "power3.out",
      };

      if (trigger) {
        gsap.to(units, {
          ...animation,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      } else {
        gsap.to(units, animation);
      }
    },
    { scope: containerRef as RefObject<HTMLElement | null>, dependencies: [children, mode, stagger, trigger, reducedMotion] }
  );

  const Tag = as;

  return (
    <Tag ref={containerRef as RefObject<HTMLHeadingElement>} className={cn("overflow-hidden", className)}>
      {segments.map((segment, index) => (
        <span key={`${segment}-${index}`} className="inline-block overflow-hidden align-top">
          <span data-split-unit className="inline-block will-change-transform">
            {segment}
            {mode === "words" && index < segments.length - 1 ? "\u00A0" : ""}
            {mode === "lines" && index < segments.length - 1 ? <br /> : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}
