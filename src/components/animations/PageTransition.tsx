"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type PageTransitionProps = {
  children: ReactNode;
  pageKey: string;
  title?: string;
  className?: string;
};

export function PageTransition({
  children,
  pageKey,
  title,
  className,
}: PageTransitionProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false
  );

  const duration = reducedMotion ? 0.2 : isMobile ? 0.45 : 0.7;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        className={cn("relative", className)}
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: reducedMotion ? 1 : 0 }}
        transition={{ duration: duration * 0.3 }}
      >
        <AnimatePresence>
          {title && !reducedMotion && (
            <motion.div
              key={`overlay-${pageKey}`}
              className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration * 0.2, delay: duration * 0.6 }}
            >
              {/* Dark overlay enters from side */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: COLORS.obsidian }}
                initial={{ x: "100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "-100%" }}
                transition={{ duration, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Split panels on exit */}
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{ backgroundColor: COLORS.deepForest }}
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: duration * 0.5, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.div
                className="absolute inset-y-0 right-0 w-1/2"
                style={{ backgroundColor: COLORS.deepForest }}
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: duration * 0.5, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Page title through mask */}
              <div className="relative z-10 overflow-hidden px-6">
                <motion.h2
                  className="text-3xl font-bold uppercase tracking-[0.2em] md:text-5xl"
                  style={{ color: COLORS.metallicSilver }}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: duration * 0.45, ease: [0.76, 0, 0.24, 1] }}
                >
                  {title}
                </motion.h2>
                <motion.div
                  className="mx-auto mt-4 h-[2px] w-16"
                  style={{ backgroundColor: COLORS.burntOrange }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: duration * 0.35, delay: 0.1 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : isMobile ? 8 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration * 0.5,
            delay: reducedMotion || !title ? 0 : duration * 0.35,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
