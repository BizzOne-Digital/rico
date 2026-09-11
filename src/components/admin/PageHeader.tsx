"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminUser } from "@/components/admin/AdminUserContext";

export interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const user = useAdminUser();
  return <AdminHeader user={user} title={title} description={description} />;
}
