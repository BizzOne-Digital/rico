"use client";

import type { SessionUser } from "@/types";
import { createContext, useContext } from "react";

export const AdminUserContext = createContext<SessionUser | null>(null);

export function useAdminUser() {
  const user = useContext(AdminUserContext);
  if (!user) throw new Error("useAdminUser must be used within dashboard layout");
  return user;
}
