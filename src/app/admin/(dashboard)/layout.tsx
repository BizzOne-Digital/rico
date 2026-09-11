"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminUserContext } from "@/components/admin/AdminUserContext";
import type { SessionUser } from "@/types";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          throw new Error("Unauthorized");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#143D2D] border-r-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminUserContext.Provider value={user}>
      <div className="min-h-screen bg-[#F5F3EC]">
        <AdminSidebar />
        <div className="lg:pl-64">
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AdminUserContext.Provider>
  );
}
