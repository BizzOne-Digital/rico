"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@/hooks/useGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_STEPS = [
  {
    title: "Source",
    description:
      "We partner with certified growers who cultivate 100% fruiting body mushrooms in pristine environments.",
    accent: "electric",
  },
  {
    title: "Extract",
    description:
      "Dual-extraction methods unlock the full spectrum of beta-glucans, triterpenes, and bioactive compounds.",
    accent: "botanical",
  },
  {
    title: "Formulate",
    description:
      "Our team of wellness experts blends precise doses with complementary botanicals for targeted benefits.",
    accent: "burntOrange",
  },
  {
    title: "Ritual",
    description:
      "Integrate into your daily routine — morning focus, afternoon energy, or evening recovery.",
    accent: "electric",
  },
] as const;

export interface SourceToRitualProps {
  className?: string;
}

export function SourceToRitual({ className }: SourceToRitualProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current || reducedMotion) return;

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const steps = sectionRef.current.querySelectorAll<HTMLElement>("[data-story-step]");
      const progress = progressRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=200%" : "+=300%",
          pin: pinRef.current,
          scrub: isMobile ? 0.5 : 1,
          anticipatePin: 1,
        },
      });

      steps.forEach((step, index) => {
        if (index === 0) {
          gsap.set(step, { autoAlpha: 1, y: 0 });
        } else {
          gsap.set(step, { autoAlpha: 0, y: 40 });
        }

        if (index > 0) {
          tl.to(
            steps[index - 1],
            { autoAlpha: 0, y: -30, duration: 0.5 },
            index * 0.8
          ).to(step, { autoAlpha: 1, y: 0, duration: 0.5 }, index * 0.8 + 0.2);
        }
      });

      if (progress) {
        tl.to(
          progress,
          { scaleX: 1, ease: "none", duration: steps.length * 0.8 },
          0
        );
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full max-w-full overflow-x-clip bg-obsidian text-warm-white", className)}
    >
      <div ref={pinRef} className="flex min-h-screen items-center">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 sm:py-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
              Our Process
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl">
              From Source
              <br />
              <span className="text-gradient-green">to Ritual</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-warm-white/70">
              Every product follows a deliberate journey — from sustainable sourcing
              to your daily wellness practice.
            </p>

            <div className="mt-8 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-electric via-botanical to-burnt-orange">
              <div ref={progressRef} className="h-full w-full origin-left scale-x-0 bg-electric" />
            </div>
          </div>

          <div className="relative min-h-[280px]">
            {STORY_STEPS.map((step, index) => (
              <div
                key={step.title}
                data-story-step
                className={cn(
                  "absolute inset-0 flex flex-col justify-center",
                  index === 0 ? "opacity-100" : "opacity-0"
                )}
              >
                <span
                  className={cn(
                    "text-6xl font-serif sm:text-7xl",
                    step.accent === "electric" && "text-electric",
                    step.accent === "botanical" && "text-botanical",
                    step.accent === "burntOrange" && "text-burnt-orange"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-2xl sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-warm-white/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
