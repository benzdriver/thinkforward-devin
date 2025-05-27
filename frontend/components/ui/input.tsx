import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { baseVariants, componentVariants } from "../../lib/theme/variants";

const inputVariants = cva(
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400",
  {
    variants: {
      variant: {
        default: "border-secondary-200 focus:ring-primary-400 dark:border-neutral-700 dark:focus:ring-primary-500",
        error: "border-destructive focus:ring-destructive-300 dark:border-destructive-700 dark:focus:ring-destructive-400",
        success: "border-success-300 focus:ring-success-400 dark:border-success-700 dark:focus:ring-success-500",
        warning: "border-warning-300 focus:ring-warning-400 dark:border-warning-700 dark:focus:ring-warning-500",
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    label, 
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
          <label className={cn("block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1.5", labelClassName)}>
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ 
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
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-destructive dark:text-destructive-400">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
