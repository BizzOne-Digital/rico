import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";
import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      placeholder,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium tracking-wide text-warm-white/90"
          >
            {label}
            {required ? <span className="ml-1 text-[#F05A28]">*</span> : null}
          </label>
        ) : null}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            className={cn(
              "flex h-11 w-full appearance-none rounded-xl border bg-obsidian px-4 pr-10 text-sm text-warm-white",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-[#161a18]",
              error
                ? "border-burnt-orange focus-visible:ring-burnt-orange"
                : "border-deep-forest/60 hover:border-electric/40",
              className
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-electric"
          />
        </div>

        {hint && !error ? (
          <p id={`${selectId}-hint`} className="text-xs text-metallic-silver">
            {hint}
          </p>
        ) : null}

        {error ? (
          <p id={`${selectId}-error`} className="text-xs text-[#F05A28]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
