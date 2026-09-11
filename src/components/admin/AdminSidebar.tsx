"use client";

import {
  Calendar,
  Close,
  Grid,
  Home,
  Leaf,
  Menu,
  Package,
  Settings,
} from "@/components/icons";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Grid },
  { href: "/admin/services", label: "Services", icon: Leaf },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/faqs", label: "FAQs", icon: Grid },
  { href: "/admin/media", label: "Media", icon: Grid },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#2D6A4F]/30 px-5 py-6">
        <Link href="/admin" className="block" onClick={() => setMobileOpen(false)}>
          <p className="text-lg font-semibold text-[#F5F3EC]">{BRAND.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#55C878]">
            Admin Portal
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#2D6A4F] text-[#F5F3EC] shadow-[0_0_20px_rgba(85,200,120,0.15)]"
                  : "text-[#C8C9C7] hover:bg-[#143D2D] hover:text-[#F5F3EC]"
              )}
            >
              <Icon size={18} className={active ? "text-[#55C878]" : undefined} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#2D6A4F]/30 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#C8C9C7]">
          Engineered for Every Move
        </p>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#143D2D] text-[#F5F3EC] lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#080A09]/70"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="relative h-full w-72 bg-[#111411] shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 text-[#C8C9C7] hover:bg-[#143D2D]"
              aria-label="Close menu"
            >
              <Close size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <aside className="hidden h-screen w-64 shrink-0 bg-[#111411] lg:fixed lg:left-0 lg:top-0 lg:block">
        {sidebarContent}
      </aside>
    </>
  );
}
