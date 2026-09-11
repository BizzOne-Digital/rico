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
            className="block text-sm font-medium tracking-wide text-[#143D2D]"
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
            "flex h-11 w-full rounded-xl border bg-[#F5F3EC] px-4 text-sm text-[#080A09]",
            "placeholder:text-[#C8C9C7] transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55C878] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3EC]",
            error
              ? "border-[#F05A28] focus-visible:ring-[#F05A28]"
              : "border-[#EDE9DE] hover:border-[#C8C9C7]",
            className
          )}
          {...props}
        />

        {hint && !error ? (
          <p id={`${inputId}-hint`} className="text-xs text-[#2D6A4F]">
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
