"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxLayer = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

type ParallaxSectionProps = {
  layers: ParallaxLayer[];
  className?: string;
  height?: string;
};

export function ParallaxSection({
  layers,
  className,
  height = "min-h-[50vh]",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || reducedMotion) return;

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const layerEls = sectionRef.current.querySelectorAll<HTMLElement>("[data-parallax-layer]");

      layerEls.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed ?? "0.2");
        const adjustedSpeed = isMobile ? speed * 0.4 : speed;

        gsap.to(layer, {
          yPercent: adjustedSpeed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: isMobile ? 0.5 : true,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [layers.length, reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-hidden", height, className)}
    >
      {layers.map((layer, index) => (
        <div
          key={index}
          data-parallax-layer
          data-speed={layer.speed ?? 0.15 + index * 0.1}
          className={cn("absolute inset-0", layer.className)}
        >
          {layer.children}
        </div>
      ))}
    </section>
  );
}
