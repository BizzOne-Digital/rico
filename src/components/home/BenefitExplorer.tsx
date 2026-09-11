"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ProductCard, type ShopProduct } from "@/components/shop/ProductCard";
import { BENEFITS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface BenefitExplorerProps {
  products: ShopProduct[];
  className?: string;
}

export function BenefitExplorer({ products, className }: BenefitExplorerProps) {
  const [activeBenefit, setActiveBenefit] = useState<string>(BENEFITS[0]);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.benefits?.some(
          (b) => b.toLowerCase() === activeBenefit.toLowerCase()
        )
      ),
    [products, activeBenefit]
  );

  const displayProducts = filteredProducts.slice(0, 3);

  return (
    <section className={cn("section-spacing bg-warm-white", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
              Benefit Explorer
            </p>
            <h2 className="mt-3 font-serif text-3xl text-deep-forest sm:text-4xl">
              What Do You Need Today?
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {BENEFITS.map((benefit) => {
              const active = activeBenefit === benefit;
              return (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => setActiveBenefit(benefit)}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-300",
                    active
                      ? "bg-deep-forest text-electric shadow-[0_0_20px_rgba(85,200,120,0.2)]"
                      : "border border-soft-ivory bg-soft-ivory/50 text-botanical hover:border-botanical hover:text-deep-forest"
                  )}
                >
                  {benefit}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="mt-8 min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBenefit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {displayProducts.length > 0 ? (
                displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-botanical/30 px-6 py-10 text-center">
                  <p className="text-sm text-botanical">
                    No products found for {activeBenefit}. Try another benefit.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
