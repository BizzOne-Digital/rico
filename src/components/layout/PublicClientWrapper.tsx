"use client";

import { useState, type ReactNode } from "react";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { GrainOverlay } from "@/components/animations/GrainOverlay";
import { Preloader } from "@/components/animations/Preloader";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { CartDrawer } from "@/components/layout/CartDrawer";

export function PublicClientWrapper({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      <SmoothScroll>
        <div className="site-root flex min-h-full min-w-0 w-full max-w-full flex-col overflow-x-clip">
          <GrainOverlay />
          {children}
          <CartDrawer />
          <ToastProvider />
        </div>
      </SmoothScroll>
    </>
  );
}
