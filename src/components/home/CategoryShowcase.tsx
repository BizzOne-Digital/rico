"use client";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ArrowRight } from "@/components/icons";
import { ProductImage } from "@/components/ui/ProductImage";
import { CATEGORY_IMAGES } from "@/lib/page-images";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CategoryShowcaseProps {
  categories: CategoryItem[];
  className?: string;
}

export function CategoryShowcase({ categories, className }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className={cn("section-spacing bg-carbon", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-electric">
              Shop by Category
            </p>
            <h2 className="mt-3 font-serif text-3xl text-warm-white sm:text-4xl">
              Find Your Ritual
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <ScrollReveal key={category._id} delay={index * 0.08}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-deep-forest/50 bg-obsidian"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ProductImage
                      src={category.image || CATEGORY_IMAGES[category.slug]}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-xl text-warm-white">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-warm-white/70">
                        {category.description}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase text-electric opacity-0 transition-opacity group-hover:opacity-100">
                      Explore
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
