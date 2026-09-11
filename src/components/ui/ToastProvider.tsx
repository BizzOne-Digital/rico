"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-[#EDE9DE] bg-[#F5F3EC] text-[#080A09] shadow-lg",
          title: "text-sm font-semibold text-[#143D2D]",
          description: "text-sm text-[#2D6A4F]",
          actionButton:
            "rounded-full bg-[#143D2D] px-3 py-1 text-xs font-medium text-[#F5F3EC]",
          cancelButton:
            "rounded-full border border-[#C8C9C7] px-3 py-1 text-xs text-[#143D2D]",
          closeButton:
            "border-[#EDE9DE] bg-[#F5F3EC] text-[#143D2D] hover:bg-[#EDE9DE]",
          success: "border-[#55C878]/40",
          error: "border-[#F05A28]/40",
        },
      }}
    />
  );
}
