"use client";

import { useEffect, useRef, useState } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";

export interface SiteHeaderProps {
  announcement?: string;
}

const DEFAULT_HEADER_HEIGHT = 148;

function syncHeaderHeight(height: number) {
  document.documentElement.style.setProperty("--site-header-height", `${height}px`);
}

export function SiteHeader({ announcement }: SiteHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_HEIGHT);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const update = () => {
      const height = node.offsetHeight || DEFAULT_HEADER_HEIGHT;
      setHeaderHeight(height);
      syncHeaderHeight(height);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, [announcement]);

  return (
    <>
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-x-clip">
        <AnnouncementBar announcement={announcement} />
        <Header />
      </div>
      <div
        aria-hidden
        className="pointer-events-none shrink-0"
        style={{ height: headerHeight }}
      />
    </>
  );
}
