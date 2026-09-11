import { cn } from "@/lib/utils";
import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function IconBase({
  size = 24,
  className,
  children,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function Cart(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </IconBase>
  );
}

export function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function Close(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconBase>
  );
}

export function Plus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}

export function Minus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function Trash(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 14h10l1-14" />
    </IconBase>
  );
}

export function Edit(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </IconBase>
  );
}

export function Eye(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  );
}

export function Upload(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 20h16" />
    </IconBase>
  );
}

export function Check(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12 5 5 9-9" />
    </IconBase>
  );
}

export function X(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function Star(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.4 4.9 5.4.8-3.9 3.8.9 5.3L12 15.8 7.2 17.8l.9-5.3L4.2 8.7l5.4-.8Z" />
    </IconBase>
  );
}

export function Phone(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.5 2.6a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.2 1.7.4 2.6.5A2 2 0 0 1 22 16.9Z" />
    </IconBase>
  );
}

export function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </IconBase>
  );
}

export function MapPin(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

export function Instagram(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function Facebook(props: IconProps) {
  return (
    <IconBase {...props} viewBox="0 0 24 24">
      <path d="M15 8h3V4h-3c-2.8 0-5 2.2-5 5v3H7v4h3v6h4v-6h3.5l.5-4H14V9c0-.6.4-1 1-1Z" />
    </IconBase>
  );
}

export function Twitter(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4l7.5 10.5L4 20h2.5l5.8-6.8L17 20h4l-7.8-11.2L20 4h-2.5l-5.3 6.2L8 4H4Z" />
    </IconBase>
  );
}

export function Linkedin(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="9" width="4" height="11" />
      <circle cx="6" cy="6" r="2" />
      <path d="M14 9v2.1c.8-1.2 2.2-2 3.8-2 3 0 4.2 2 4.2 5.6V20h-4v-6.8c0-1.6-.6-2.7-2-2.7-1.1 0-1.7.7-2 1.4V20h-4V9h4Z" />
    </IconBase>
  );
}

export function Youtube(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="m10 9.5 6 3.5-6 3.5v-7Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function Tiktok(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a6 6 0 0 0 6 6" />
    </IconBase>
  );
}

export function Mushroom(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3c-3.5 0-6 2.5-6 5.5 0 1.2.4 2.3 1 3.2h10c.6-.9 1-2 1-3.2C18 5.5 15.5 3 12 3Z" />
      <path d="M8 11.7V20h8v-8.3" />
      <path d="M10 20v-3h4v3" />
    </IconBase>
  );
}

export function Infinity(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 12c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2 0.7-1.2 2-2 3.5-2 2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.5 0-2.8-.8-3.5-2-.7 1.2-2 2-3.5 2-2.2 0-4-1.8-4-4Z" />
    </IconBase>
  );
}

export function Leaf(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 20c8-1 12-6 14-14-8 2-13 6-14 14Z" />
      <path d="M6 20c3-5 8-8 14-10" />
    </IconBase>
  );
}

export function Zap(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </IconBase>
  );
}

export function Shield(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 20 6v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z" />
    </IconBase>
  );
}

export function Heart(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20s-7-4.4-7-9.5C5 7.5 7.5 5 10.5 5c1.7 0 3.2.8 4 2.1.8-1.3 2.3-2.1 4-2.1 3 0 5.5 2.5 5.5 5.5C19 15.6 12 20 12 20Z" />
    </IconBase>
  );
}

export function Brain(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 5.5A3.5 3.5 0 0 0 4.5 9v2.5A3.5 3.5 0 0 0 8 15v-1.5" />
      <path d="M16 5.5A3.5 3.5 0 0 1 19.5 9v2.5A3.5 3.5 0 0 1 16 15v-1.5" />
      <path d="M8 8.5c0-1.5 1-2.5 2.5-2.5h3c1.5 0 2.5 1 2.5 2.5v5c0 1.5-1 2.5-2.5 2.5h-3C9 16 8 15 8 13.5v-5Z" />
      <path d="M12 6v12" />
    </IconBase>
  );
}

export function Clock(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function Calendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </IconBase>
  );
}

export function User(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" />
    </IconBase>
  );
}

export function Package(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path d="M12 11v9M3 7v10l9 4 9-4V7" />
    </IconBase>
  );
}

export function Settings(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </IconBase>
  );
}

export function LogOut(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </IconBase>
  );
}

export function Home(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m4 10 8-6 8 6v10a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1V10Z" />
    </IconBase>
  );
}

export function Filter(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </IconBase>
  );
}

export function Grid(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </IconBase>
  );
}

export function List(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </IconBase>
  );
}
