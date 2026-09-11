"use client";

import { LogOut, User } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { SessionUser } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface AdminHeaderProps {
  user: SessionUser;
  title: string;
  description?: string;
}

export function AdminHeader({ user, title, description }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#EDE9DE] pb-6">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-2xl font-semibold text-[#143D2D]">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-[#2D6A4F]">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-[#EDE9DE] bg-white px-4 py-2 sm:flex">
          <User size={16} className="text-[#2D6A4F]" />
          <span className="text-sm text-[#143D2D]">{user.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
}
