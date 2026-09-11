import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Tiktok,
  Twitter,
  Youtube,
} from "@/components/icons";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { BRAND } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { ProductCategory, getSiteSettings } from "@/models";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/booking", label: "Booking" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
];

export async function Footer() {
  await connectDB();
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    ProductCategory.find({ active: true }).sort({ displayOrder: 1 }).limit(8),
  ]);

  const socialConfig = [
    { key: "instagram" as const, Icon: Instagram, label: "Instagram" },
    { key: "facebook" as const, Icon: Facebook, label: "Facebook" },
    { key: "twitter" as const, Icon: Twitter, label: "Twitter" },
    { key: "linkedin" as const, Icon: Linkedin, label: "LinkedIn" },
    { key: "youtube" as const, Icon: Youtube, label: "YouTube" },
    { key: "tiktok" as const, Icon: Tiktok, label: "TikTok" },
  ];

  const socials = socialConfig.filter(
    (s) => settings.socialLinks?.[s.key]?.trim()
  );

  return (
    <footer className="w-full max-w-full overflow-x-clip bg-obsidian text-warm-white">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt={BRAND.name}
              width={220}
              height={80}
              className="h-16 w-auto object-contain md:h-20"
            />
            <p className="text-sm leading-relaxed text-metallic-silver">
              {settings.footerContent}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-electric">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-metallic-silver hover:text-electric transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-electric">
              Shop Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id.toString()}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-sm text-metallic-silver hover:text-electric transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mb-4 mt-8 text-xs font-semibold uppercase tracking-[0.15em] text-electric">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-metallic-silver">
              {settings.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex items-start gap-2 hover:text-electric transition-colors"
                  >
                    <Mail size={16} className="mt-0.5 shrink-0" />
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/\D/g, "")}`}
                    className="flex items-start gap-2 hover:text-electric transition-colors"
                  >
                    <Phone size={16} className="mt-0.5 shrink-0" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  {settings.address}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-electric">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-metallic-silver">
              Join for wellness insights and product updates.
            </p>
            <NewsletterForm />

            {socials.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {socials.map(({ key, Icon, label }) => (
                  <a
                    key={key}
                    href={settings.socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-forest text-metallic-silver transition-colors hover:border-electric hover:text-electric"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-deep-forest pt-6 md:flex-row">
          <p className="text-xs text-metallic-silver">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-metallic-silver hover:text-electric transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
