"use client";

import { Counter } from "@/components/animations/Counter";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ProductImage } from "@/components/ui/ProductImage";
import { PAGE_IMAGES } from "@/lib/page-images";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface MycoDoseFeatureProps {
  image?: string;
  className?: string;
}

const HIGHLIGHTS = [
  { value: 6, suffix: "g", label: "Mushroom blend per serving" },
  { value: 0, suffix: "", label: "Added sugars", prefix: "Zero " },
  { value: 100, suffix: "%", label: "Fruiting body extract" },
];

export function MycoDoseFeature({
  image = PAGE_IMAGES.mycoDose,
  className,
}: MycoDoseFeatureProps) {
  return (
    <section className={cn("section-spacing relative overflow-hidden bg-deep-forest", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(85,200,120,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="absolute -inset-4 rounded-3xl bg-electric/10 blur-2xl" />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-electric/20 glow-green">
                <ProductImage
                  src={image}
                  alt="Myco Dose functional beverage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
                New Release
              </p>
              <h2 className="mt-3 font-serif text-3xl text-warm-white sm:text-4xl lg:text-5xl">
                Myco Dose
              </h2>
              <p className="mt-2 text-lg text-electric">Functional Beverage</p>

              <p className="mt-6 max-w-lg text-sm leading-relaxed text-warm-white/75">
                A ready-to-drink functional beverage infused with premium mushroom
                extracts. Clean energy, mental clarity, and immune support — without
                the jitters or crash.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6">
                {HIGHLIGHTS.map((item) => (
                  <div key={item.label} className="text-center">
                    <Counter
                      value={item.value}
                      suffix={item.suffix}
                      prefix={item.prefix ?? ""}
                      className="text-2xl font-semibold text-electric sm:text-3xl"
                    />
                    <p className="mt-2 text-[10px] leading-tight tracking-wide text-warm-white/60 sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/shop?category=beverages">
                  <MagneticButton size="lg" variant="primary" className="bg-electric text-obsidian hover:bg-botanical hover:text-warm-white">
                    Shop Myco Dose
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
