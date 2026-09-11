"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Star } from "@/components/icons";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface Testimonial {
  name: string;
  role?: string;
  content: string;
  rating: number;
  active?: boolean;
}

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialsSection({
  testimonials,
  className,
}: TestimonialsSectionProps) {
  const active = testimonials.filter((t) => t.active !== false);

  if (active.length === 0) return null;

  return (
    <section className={cn("section-spacing bg-warm-white", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
              Testimonials
            </p>
            <h2 className="mt-3 font-serif text-3xl text-deep-forest sm:text-4xl">
              What Our Community Says
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((testimonial, index) => (
            <ScrollReveal key={`${testimonial.name}-${index}`} delay={index * 0.08}>
              <motion.blockquote
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col rounded-2xl border border-soft-ivory bg-soft-ivory/30 p-6"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        i < testimonial.rating
                          ? "fill-burnt-orange text-burnt-orange"
                          : "text-metallic-silver"
                      )}
                    />
                  ))}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-botanical">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <footer className="mt-5 border-t border-soft-ivory pt-4">
                  <cite className="not-italic">
                    <span className="text-sm font-semibold text-deep-forest">
                      {testimonial.name}
                    </span>
                    {testimonial.role && (
                      <span className="mt-0.5 block text-xs text-botanical/80">
                        {testimonial.role}
                      </span>
                    )}
                  </cite>
                </footer>
              </motion.blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
