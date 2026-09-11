"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Mushroom, Zap, Infinity } from "@/components/icons";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Leaf, label: "Natural Ingredients" },
  { icon: Mushroom, label: "Thoughtful Formulations" },
  { icon: Zap, label: "Daily Support" },
  { icon: Infinity, label: "A More Optimized You" },
];

const VERTICAL_WORDS = [
  "Natural",
  "Focus",
  "Balance",
  "Energy",
  "Clarity",
  "A Brighter You",
];

export interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("relative min-h-svh w-full max-w-full overflow-hidden", className)}>
      {/* SS2 Background — extends behind fixed header */}
      <div className="page-hero-bg absolute bottom-0 left-0 right-0 min-h-full">
        <Image
          src="/images/hero-bg.jpg"
          alt="Fungtional Wellness products in a mystical forest setting"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0b]/90 via-[#0a0f0b]/55 to-transparent" />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0f0b]/80 to-transparent" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto flex min-h-svh w-full min-w-0 max-w-[1400px] flex-col justify-center px-4 pb-36 pt-6 sm:px-6 sm:pb-32 md:px-8 lg:px-10 lg:pb-32">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Pre-headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-5 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#d47d37]" aria-hidden />
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d47d37] sm:text-[11px]">
              Optimized Living, Naturally
            </p>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
          >
            <span className="text-warm-white">Fungtional </span>
            <span className="text-[#d47d37]">living </span>
            <span className="text-warm-white">made </span>
            <span className="text-[#d47d37]">simple.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-warm-white/85 sm:text-base md:max-w-lg md:text-[17px]"
          >
            Functional mushrooms and thoughtful formulations designed to support how
            you think, feel and move.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-5 sm:gap-7"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#d47d37] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#c06d2d] hover:shadow-[0_8px_30px_rgba(212,125,55,0.35)] sm:text-xs"
            >
              Shop the Collection
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-warm-white transition-colors hover:text-[#d47d37] sm:text-xs"
            >
              Explore Wellness
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Bottom feature icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-6 sm:right-6 lg:left-10"
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 md:gap-10">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon size={18} className="text-warm-white/80" />
                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-warm-white/75 sm:text-[10px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right vertical text */}
      <div
        className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex lg:right-8"
        aria-hidden
      >
        {VERTICAL_WORDS.map((word, i) => (
          <motion.span
            key={word}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
            className="text-[9px] font-medium uppercase tracking-[0.22em] text-warm-white/50 [writing-mode:vertical-rl] rotate-180"
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-warm-white to-transparent" />
    </section>
  );
}
