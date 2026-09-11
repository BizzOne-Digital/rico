import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { getSiteSettings } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { CATALOGUE_PRICE_LABELS } from "@/lib/product-pricing";
import { PAGE_IMAGES } from "@/lib/page-images";
import { PageHero } from "@/components/layout/PageHero";
import { SplitImageSection } from "@/components/layout/SplitImageSection";
import { ImageBanner } from "@/components/layout/ImageBanner";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Counter } from "@/components/animations/Counter";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, Leaf, Mushroom, Shield, Zap } from "@/components/icons";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description: `Learn about ${BRAND.name} — making functional mushroom wellness accessible through clean, natural products.`,
  path: "/about",
});

const VALUES = [
  {
    icon: Mushroom,
    title: "Full Fruiting Body Only",
    description:
      "Every mushroom product starts with 100% fruiting body material. No mycelium on grain, no fillers, no shortcuts.",
  },
  {
    icon: Leaf,
    title: "Clean Formulations",
    description:
      "Thoughtfully developed blends with complementary botanicals — alcohol-free drops, non-GMO ingredients, vegan-friendly options.",
  },
  {
    icon: Zap,
    title: "Built for Daily Life",
    description:
      "Capsules, powders, oral drops, beverages and sprays designed to fit real routines — morning focus, mid-day fuel, evening calm.",
  },
  {
    icon: Shield,
    title: "Quality You Can Trust",
    description:
      "Health Canada NPNs on key products, transparent labeling, and a team that stands behind every jar, bottle and spray.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Source",
    description:
      "We work with growers who cultivate premium fruiting body mushrooms in controlled, quality-focused environments.",
  },
  {
    step: "02",
    title: "Extract",
    description:
      "Careful extraction preserves the beta-glucans and bioactive compounds that make functional mushrooms worth taking daily.",
  },
  {
    step: "03",
    title: "Formulate",
    description:
      "Our team blends precise mushroom doses with complementary ingredients — L-theanine, adaptogens, MCT and monk fruit where it matters.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "From capsules to Myco Dose beverages and Myco Mist sprays — every format is designed for convenience without compromising quality.",
  },
];

const PRODUCT_FORMATS = [
  {
    image: PAGE_IMAGES.capsules,
    title: "Capsules",
    description: "Cordyceps, Lion's Mane, Turkey Tail and My Gut+ — 60 capsules per bottle.",
    href: "/shop?category=mushroom-capsules",
    price: CATALOGUE_PRICE_LABELS.capsules,
  },
  {
    image: PAGE_IMAGES.oralDrops,
    title: "Oral Drops",
    description: "My Focus, My Fuel and My Vitality — alcohol-free 50 mL liquid formulas.",
    href: "/shop?category=mushroom-oral-drops",
    price: CATALOGUE_PRICE_LABELS.oralDrops,
  },
  {
    image: PAGE_IMAGES.powder,
    title: "Powders",
    description: "100 g jars for smoothies, coffee and daily rituals — single species and blends.",
    href: "/shop?category=mushroom-powders",
    price: CATALOGUE_PRICE_LABELS.powders,
  },
  {
    image: PAGE_IMAGES.mycoDose,
    title: "Myco Dose",
    description: "Orange Creamsicle performance beverage — 12 × 2 oz bottles per pack.",
    href: "/shop?category=beverages",
    price: CATALOGUE_PRICE_LABELS.mycoDose,
  },
  {
    image: PAGE_IMAGES.mycoMist,
    title: "Myco Mist",
    description: "Concentrated oral sprays in Energy, Focus, Calm, Immune and Sleep.",
    href: "/shop?category=myco-mist",
    price: CATALOGUE_PRICE_LABELS.mycoMist,
  },
  {
    image: PAGE_IMAGES.wellnessResearch,
    title: "Wellness Services",
    description: "Personalized assessments and optimization guidance from our team.",
    href: "/services",
    price: "Book a session",
  },
];

export default async function AboutPage() {
  await connectDB();
  const settings = await getSiteSettings();

  return (
    <div className="page-shell">
      <PageHero image={PAGE_IMAGES.mushroomsMacro} imageAlt="Functional mushrooms in natural forest setting">
        <p className="text-xs uppercase tracking-[0.28em] text-electric">Our Story</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl">
          Optimized living,
          <span className="text-electric"> naturally.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-metallic-silver">
          {BRAND.name} was created by Fungtional Labs Inc. to make the benefits of functional
          mushrooms accessible through clean, intentional products — engineered for every move.
        </p>
      </PageHero>

      <SplitImageSection image={PAGE_IMAGES.mushroomExtracts} alt="Mushroom extracts and powders">
        <p className="text-xs uppercase tracking-[0.22em] text-electric">Who We Are</p>
        <h2 className="mt-3 font-serif text-3xl text-deep-forest md:text-4xl">The Fungtional Vision</h2>
        <div className="mt-6 space-y-4 text-botanical leading-relaxed">
          <p>
            Fungtional Labs Inc. created {BRAND.name} because we believed functional mushroom
            wellness shouldn&apos;t feel complicated, clinical or out of reach. We set out to build
            products people actually want to take every day — clean labels, honest ingredients, and
            formats that fit modern life.
          </p>
          <p>
            From Cordyceps and Lion&apos;s Mane capsules to alcohol-free oral drops, versatile
            powders, Myco Dose beverages and Myco Mist sprays, every product is rooted in the same
            promise: <strong className="font-medium text-deep-forest">100% full fruiting body mushrooms</strong> —
            no mycelium, no fillers.
          </p>
        </div>
        <ul className="mt-8 space-y-3">
          {[
            "Health Canada NPNs on select products",
            "Capsules, drops, powders, beverages & sprays",
            "Wellness assessments & personal optimization",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-deep-forest">
              <Check size={16} className="mt-0.5 shrink-0 text-electric" />
              {item}
            </li>
          ))}
        </ul>
      </SplitImageSection>

      <section className="section-spacing bg-obsidian text-warm-white">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-electric">What We Stand For</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Our Core Values</h2>
            <p className="mt-4 text-metallic-silver">
              Four principles guide every product we develop and every conversation we have with our
              community.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-deep-forest/60 bg-carbon/50 p-6 transition-colors hover:border-electric/40 hover:bg-carbon">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/10 text-electric">
                    <value.icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-metallic-silver">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-warm-white">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-botanical">From Forest to Routine</p>
            <h2 className="mt-3 font-serif text-3xl text-deep-forest md:text-4xl">
              How We Build Every Product
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="relative">
                  {i < PROCESS.length - 1 && (
                    <div
                      className="absolute left-8 top-16 hidden h-px w-[calc(100%+2rem)] bg-gradient-to-r from-electric/40 to-transparent lg:block"
                      aria-hidden
                    />
                  )}
                  <span className="font-serif text-4xl text-electric/30">{item.step}</span>
                  <h3 className="mt-2 font-serif text-xl text-deep-forest">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-botanical">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ImageBanner image={PAGE_IMAGES.hero} alt="Fungtional Wellness lifestyle" height="md" />

      <section className="section-spacing bg-soft-ivory">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-botanical">The Collection</p>
              <h2 className="mt-2 font-serif text-3xl text-deep-forest md:text-4xl">
                Products & Services
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-deep-forest transition-colors hover:text-botanical"
            >
              View full shop
              <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_FORMATS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.06}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-warm-white shadow-[0_8px_30px_rgba(8,10,9,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(8,10,9,0.12)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-warm-white/90">
                      {item.price}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-xl text-deep-forest group-hover:text-botanical transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-botanical">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-electric">
                      Explore
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-deep-forest py-14 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(85,200,120,0.15),transparent_55%)]" aria-hidden />
        <div className="relative mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-3">
            <ScrollReveal className="text-center">
              <Counter
                value={100}
                suffix="%"
                className="text-5xl font-serif text-electric md:text-6xl"
                label="Full Fruiting Body"
              />
            </ScrollReveal>
            <ScrollReveal className="text-center" delay={0.1}>
              <p className="text-5xl font-serif text-electric md:text-6xl tabular-nums">Zero</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-warm-white/70">
                Mycelium or Fillers
              </p>
            </ScrollReveal>
            <ScrollReveal className="text-center" delay={0.2}>
              <Counter
                value={20}
                suffix="+"
                className="text-5xl font-serif text-electric md:text-6xl"
                label="Products & Formats"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SplitImageSection
        image={PAGE_IMAGES.wellnessResearch}
        alt="Wellness consultation"
        reverse
        dark
      >
        <p className="text-xs uppercase tracking-[0.22em] text-electric">Beyond Products</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">Wellness That Fits You</h2>
        <p className="mt-6 leading-relaxed text-metallic-silver">
          Not sure where to start? Our wellness assessment and personal optimization sessions help
          you build a routine around your goals — whether that&apos;s sharper focus, steadier energy,
          gut support or immune resilience.
        </p>
        <p className="mt-4 text-sm text-metallic-silver/80">
          These are guided wellness conversations, not medical diagnoses. Our team helps you choose
          the right products and habits for your lifestyle.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/booking">
            <Button className="bg-electric text-obsidian hover:bg-electric/90">Book an Assessment</Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" className="border-warm-white/30 text-warm-white hover:bg-warm-white/10">
              View Services
            </Button>
          </Link>
        </div>
      </SplitImageSection>

      <section className="mx-auto w-full min-w-0 max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <ScrollReveal className="rounded-2xl border border-soft-ivory bg-soft-ivory/50 p-6 md:p-8">
          <h3 className="font-serif text-xl text-deep-forest md:text-2xl">Our Commitment to You</h3>
          <p className="mt-4 text-sm leading-relaxed text-botanical">{settings.medicalDisclaimer}</p>
        </ScrollReveal>
      </section>

      <section className="section-spacing bg-obsidian text-warm-white">
        <div className="mx-auto w-full min-w-0 max-w-4xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl">Ready to start your routine?</h2>
            <p className="mt-4 text-metallic-silver">
              Explore the full collection or book a wellness assessment with our team.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/shop">
                <Button className="bg-[#d47d37] text-white hover:bg-[#c06d2d]">Shop the Collection</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-warm-white/30 text-warm-white hover:bg-warm-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
