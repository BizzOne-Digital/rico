import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium tracking-wide text-warm-white/90"
          >
            {label}
            {required ? <span className="ml-1 text-[#F05A28]">*</span> : null}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            "flex h-11 w-full rounded-xl border bg-obsidian px-4 text-sm text-warm-white",
            "placeholder:text-metallic-silver/60 transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-[#161a18]",
            error
              ? "border-burnt-orange focus-visible:ring-burnt-orange"
              : "border-deep-forest/60 hover:border-electric/40",
            className
          )}
          {...props}
        />

        {hint && !error ? (
          <p id={`${inputId}-hint`} className="text-xs text-metallic-silver">
            {hint}
          </p>
        ) : null}

        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-[#F05A28]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
