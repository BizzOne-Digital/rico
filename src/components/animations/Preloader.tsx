"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type PreloaderProps = {
  onComplete?: () => void;
  className?: string;
};

function FWMonogram({ useLogo }: { useLogo: boolean }) {
  if (useLogo) {
    return (
      <Image
        src="/images/logo.png"
        alt="Fungtional Wellness"
        width={120}
        height={120}
        priority
        className="h-24 w-24 object-contain md:h-28 md:w-28"
      />
    );
  }

  return (
    <span
      className="font-bold tracking-[0.35em] text-[3.5rem] leading-none md:text-[4.5rem]"
      style={{ color: COLORS.metallicSilver }}
    >
      FW
    </span>
  );
}

export function Preloader({ onComplete, className }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [useLogo, setUseLogo] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/logo.png";
    img.onerror = () => setUseLogo(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (reducedMotion) {
      const timer = window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 300);
      return () => window.clearTimeout(timer);
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const duration = isMobile ? 0.6 : 1;

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      },
    });

    gsap.set(containerRef.current, { autoAlpha: 1 });
    gsap.set(monogramRef.current, { scale: 0.85, autoAlpha: 0 });
    gsap.set(sweepRef.current, { xPercent: -120, autoAlpha: 0.9 });
    gsap.set(pulseRef.current, { scale: 0.6, autoAlpha: 0 });
    gsap.set(accentRef.current, { scaleX: 0, autoAlpha: 1 });

    tl.to(monogramRef.current, {
      scale: 1,
      autoAlpha: 1,
      duration: duration * 0.5,
      ease: "power3.out",
    })
      .to(
        pulseRef.current,
        {
          scale: isMobile ? 1.2 : 1.6,
          autoAlpha: isMobile ? 0.25 : 0.45,
          duration: duration * 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        sweepRef.current,
        {
          xPercent: 120,
          duration: duration * 0.7,
          ease: "power2.inOut",
        },
        "-=0.35"
      )
      .to(
        accentRef.current,
        {
          scaleX: 1,
          duration: duration * 0.4,
          ease: "power3.out",
        },
        "-=0.25"
      )
      .to(
        pulseRef.current,
        {
          scale: isMobile ? 1.4 : 2,
          autoAlpha: 0,
          duration: duration * 0.35,
          ease: "power2.in",
        },
        "-=0.1"
      )
      .to(containerRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: duration * 0.55,
        ease: "power4.inOut",
      });

    return () => {
      tl.kill();
    };
  }, [onComplete, reducedMotion, useLogo]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden",
        className
      )}
      style={{ backgroundColor: COLORS.obsidian, clipPath: "inset(0 0 0 0)" }}
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="relative flex flex-col items-center">
        <div
          ref={pulseRef}
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${COLORS.electric}66 0%, transparent 70%)`,
          }}
        />

        <div ref={monogramRef} className="relative z-10 overflow-hidden">
          <FWMonogram useLogo={useLogo} />
          <div
            ref={sweepRef}
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background: `linear-gradient(105deg, transparent 35%, ${COLORS.metallicSilver}cc 50%, transparent 65%)`,
            }}
          />
        </div>

        <div
          ref={accentRef}
          className="mt-8 h-[2px] w-32 origin-left md:w-40"
          style={{ backgroundColor: COLORS.burntOrange }}
        />
      </div>
    </div>
  );
}
