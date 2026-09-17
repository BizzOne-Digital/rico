"use client";

import { cn, getImageSrc } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export interface ProductImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  objectPosition?: string;
}

export function ProductImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder-product.svg",
  objectPosition = "center",
  className,
  onError,
  style,
  ...props
}: ProductImageProps) {
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const resolvedSrc = getImageSrc(src, fallbackSrc);
  const displaySrc = erroredSrc === resolvedSrc ? fallbackSrc : resolvedSrc;

  return (
    <Image
      {...props}
      key={resolvedSrc}
      src={displaySrc}
      alt={alt}
      className={cn("object-cover", className)}
      style={{ ...style, objectPosition }}
      onError={(event) => {
        setErroredSrc(resolvedSrc);
        onError?.(event);
      }}
    />
  );
}
