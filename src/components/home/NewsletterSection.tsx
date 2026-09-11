"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { cn } from "@/lib/utils";

export interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function NewsletterSection({
  title = "Join the Wellness Circle",
  subtitle = "Get exclusive offers, wellness tips, and early access to new products.",
  className,
}: NewsletterSectionProps) {
  return (
    <section className={cn("section-spacing bg-carbon", className)}>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
            Newsletter
          </p>
          <h2 className="mt-3 font-serif text-3xl text-warm-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-warm-white/70">{subtitle}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
