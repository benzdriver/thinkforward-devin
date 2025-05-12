import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const radioVariants = cva(
  "focus:ring-offset-0 focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-secondary-300 text-primary focus:ring-primary-400",
        error: "border-destructive-300 text-destructive focus:ring-destructive-400",
        success: "border-success-300 text-success focus:ring-success-400",
        warning: "border-warning-300 text-warning focus:ring-warning-400",
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface RadioProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof radioVariants> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ 
    className, 
    variant = "default",
    size,
    label, 
    description,
    error,
    containerClassName,
    labelClassName,
    descriptionClassName,
    ...props 
  }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="radio"
              className={cn(
                radioVariants({ 
                  variant: error ? "error" : variant, 
                  size: size as "sm" | "md" | "lg" | undefined 
                }),
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label className={cn("font-medium text-neutral-800", labelClassName)}>
                  {label}
                </label>
              )}
              {description && (
                <p className={cn("text-neutral-600", descriptionClassName)}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Radio, radioVariants };
