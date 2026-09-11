import { ToastProvider } from "@/components/ui/ToastProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Fungtional Wellness",
  description: "Fungtional Wellness admin portal",
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
