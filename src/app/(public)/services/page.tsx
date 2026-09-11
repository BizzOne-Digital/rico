import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { createMetadata } from "@/lib/metadata";
import { BRAND } from "@/lib/constants";
import { PAGE_IMAGES } from "@/lib/page-images";
import { formatPriceDollars } from "@/lib/utils";
import { PageHero } from "@/components/layout/PageHero";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/icons";

const SERVICE_IMAGES = [
  PAGE_IMAGES.premiumProducts,
  PAGE_IMAGES.wellnessResearch,
  PAGE_IMAGES.mushroomExtracts,
];

export const metadata: Metadata = createMetadata({
  title: "Services",
  description: `Explore wellness products, assessments and personal optimization services from ${BRAND.name}.`,
  path: "/services",
});

export default async function ServicesPage() {
  await connectDB();
  const services = await Service.find({ active: true }).sort({ displayOrder: 1 });
  const data = JSON.parse(JSON.stringify(services));

  return (
    <div className="page-shell">
      <PageHero image={PAGE_IMAGES.wellnessResearch} imageAlt="Wellness research and consultation">
        <h1 className="font-serif text-4xl md:text-5xl">Our Services</h1>
        <p className="mt-4 max-w-2xl mx-auto text-metallic-silver">
          Wellness products, personalized assessments and optimization guidance — not medical diagnosis.
        </p>
      </PageHero>

      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-12">
          {data.map((service: {
            _id: string;
            title: string;
            slug: string;
            shortDescription: string;
            fullDescription: string;
            image?: string;
            benefits: string[];
            price?: number;
            duration?: string;
            ctaText: string;
            ctaLink: string;
          }, i: number) => (
            <ScrollReveal key={service._id} direction={i % 2 === 0 ? "left" : "right"}>
              <article className="grid items-center gap-8 lg:grid-cols-2">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={service.image || SERVICE_IMAGES[i % SERVICE_IMAGES.length]}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl text-deep-forest">{service.title}</h2>
                  <p className="mt-4 text-botanical leading-relaxed">{service.fullDescription || service.shortDescription}</p>
                  {service.benefits?.length > 0 && (
                    <ul className="mt-6 space-y-2">
                      {service.benefits.map((b: string) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-deep-forest">
                          <Check size={16} className="text-electric shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-botanical">
                    {service.price ? (
                      <span className="font-semibold text-deep-forest">{formatPriceDollars(service.price)}</span>
                    ) : (
                      <span className="font-semibold text-deep-forest">Contact for pricing</span>
                    )}
                    {service.duration && <span>• {service.duration}</span>}
                  </div>
                  <Link href={service.ctaLink || "/booking"} className="mt-8 inline-block">
                    <Button>{service.ctaText || "Learn More"}</Button>
                  </Link>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
