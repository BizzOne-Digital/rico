import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  magnetic?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#143D2D] text-[#F5F3EC] border border-[#2D6A4F] hover:bg-[#2D6A4F] hover:border-[#55C878] focus-visible:ring-[#55C878]",
  secondary:
    "bg-[#111411] text-[#F5F3EC] border border-[#143D2D] hover:bg-[#143D2D] hover:border-[#2D6A4F] focus-visible:ring-[#2D6A4F]",
  outline:
    "bg-transparent text-deep-forest border border-botanical hover:bg-soft-ivory hover:text-deep-forest focus-visible:ring-botanical",
  ghost:
    "bg-transparent text-deep-forest border border-transparent hover:bg-soft-ivory hover:text-deep-forest focus-visible:ring-metallic-silver",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.08em] uppercase",
  md: "h-11 px-6 text-sm tracking-[0.06em] uppercase",
  lg: "h-12 px-8 text-sm tracking-[0.06em] uppercase",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      magnetic = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3EC]",
          "disabled:pointer-events-none disabled:opacity-50",
          "before:pointer-events-none before:absolute before:inset-0 before:translate-x-[-120%] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-[120%]",
          magnetic &&
            "will-change-transform transition-transform duration-200 ease-out hover:shadow-[0_0_24px_rgba(85,200,120,0.25)]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            <span>Loading</span>
          </>
        ) : (
          <span className="relative z-10">{children}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
