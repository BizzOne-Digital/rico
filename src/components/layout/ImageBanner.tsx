import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ImageBannerProps {
  image: string;
  alt: string;
  className?: string;
  height?: "sm" | "md" | "lg";
}

const heights = {
  sm: "h-48 md:h-56",
  md: "h-56 md:h-72",
  lg: "h-64 md:h-96",
};

export function ImageBanner({ image, alt, className, height = "md" }: ImageBannerProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", heights[height], className)}>
      <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
    </div>
  );
}
