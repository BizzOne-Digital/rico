"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type UseGSAPCallback = (context: gsap.Context) => void | (() => void);

type UseGSAPOptions = {
  scope?: RefObject<HTMLElement | null>;
  dependencies?: DependencyList;
};

export function useGSAP(
  callback: UseGSAPCallback,
  options?: UseGSAPOptions
): RefObject<gsap.Context | null> {
  const contextRef = useRef<gsap.Context | null>(null);
  const { scope, dependencies = [] } = options ?? {};

  useEffect(() => {
    const target = scope?.current ?? undefined;

    const ctx = gsap.context(function (this: gsap.Context) {
      const cleanup = callback(this);
      if (typeof cleanup === "function") {
        return cleanup;
      }
    }, target);

    contextRef.current = ctx;

    return () => {
      ctx.revert();
      contextRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return contextRef;
}
