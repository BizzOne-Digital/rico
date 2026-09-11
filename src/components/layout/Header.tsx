"use client";

import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Cart, X } from "@/components/icons";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
      setSearchOpen(false);
    });
  }, [pathname]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = new FormData(form).get("q") as string;
    if (q?.trim()) router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "transition-all duration-500",
        transparent ? "bg-transparent" : "glass-dark"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:px-10 lg:py-5">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex shrink-0 items-center gap-3">
          <Image
            src="/images/logo.png"
            alt={BRAND.name}
            width={80}
            height={80}
            className="h-11 w-11 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[72px] lg:w-[72px]"
            priority
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold italic leading-tight tracking-[0.06em] text-warm-white md:text-base">
              FUNGTIONAL WELLNESS
            </p>
            <p className="mt-0.5 text-[9px] font-medium tracking-[0.18em] text-[#d47d37] md:text-[10px]">
              ENGINEERED FOR EVERY MOVE
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 xl:gap-9 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[11px] font-medium uppercase tracking-[0.14em] text-warm-white/90 transition-colors hover:text-warm-white"
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 right-0 mx-auto h-[2px] w-4 bg-[#d47d37]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-warm-white transition-colors hover:text-[#d47d37]"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            id="cart-icon"
            data-cart-icon
            onClick={toggleCart}
            className="relative rounded-full p-2 text-warm-white transition-colors hover:text-[#d47d37]"
            aria-label={`Cart, ${totalItems} items`}
          >
            <Cart size={18} />
            <AnimatePresence mode="popLayout">
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d47d37] px-0.5 text-[9px] font-bold text-white"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="mx-2 hidden h-5 w-px bg-warm-white/30 sm:block" aria-hidden />

          <Link
            href="/booking"
            className="hidden rounded-full border border-warm-white/80 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-warm-white transition-all hover:border-warm-white hover:bg-warm-white/10 sm:inline-block md:px-5 md:py-2.5 md:text-[11px]"
          >
            Book an Assessment
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-warm-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSearch}
            className="overflow-hidden border-t border-warm-white/10 bg-obsidian/95 px-5 py-3"
          >
            <input
              name="q"
              type="search"
              placeholder="Search products..."
              className="w-full rounded-full border border-warm-white/20 bg-transparent px-5 py-2.5 text-sm text-warm-white placeholder:text-warm-white/40 focus:outline-none focus:ring-1 focus:ring-[#d47d37]"
            />
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-40 flex w-full max-w-full flex-col overflow-y-auto bg-obsidian pt-24 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block border-b border-deep-forest/50 py-4 text-sm font-medium uppercase tracking-[0.12em]",
                      pathname === link.href ? "text-[#d47d37]" : "text-warm-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/booking"
                className="mt-6 inline-block rounded-full border border-warm-white px-6 py-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-warm-white"
              >
                Book an Assessment
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
