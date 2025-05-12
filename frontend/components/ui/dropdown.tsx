import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const dropdownVariants = cva(
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-secondary-200 focus:ring-primary-400",
        error: "border-destructive focus:ring-destructive-300 text-destructive",
        success: "border-success-300 focus:ring-success-400",
        warning: "border-warning-300 focus:ring-warning-400",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: true,
    },
  }
);

export interface DropdownProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof dropdownVariants> {
  label?: string;
  options: DropdownOption[];
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ 
    className, 
    label, 
    options, 
    error, 
    helperText,
    variant = error ? "error" : "default",
    size,
    fullWidth,
    startIcon,
    endIcon,
    containerClassName,
    labelClassName,
    ...props 
  }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className={cn("block text-sm font-medium text-neutral-800 mb-1.5", labelClassName)}>
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {startIcon}
            </div>
          )}
          <select
            className={cn(
              dropdownVariants({ 
                variant, 
                size: size as "sm" | "md" | "lg" | undefined, 
                fullWidth 
              }),
              startIcon && "pl-9",
              endIcon && "pr-9",
              className
            )}
            ref={ref}
            {...props}
          >
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
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);
Dropdown.displayName = "Dropdown";

export { Dropdown, dropdownVariants };
