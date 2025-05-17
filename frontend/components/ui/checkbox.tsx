import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const checkboxVariants = cva(
  "rounded focus:ring-offset-0 focus:outline-none",
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

export interface CheckboxProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
      <div className={cn("space-y-2", containerClassName)} style={{ marginBottom: '0.5rem' }}>
        <div className="flex items-start" style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div className="flex items-center h-5" style={{ display: 'flex', alignItems: 'center', height: '1.25rem' }}>
            <input
              type="checkbox"
              className={cn(
                checkboxVariants({ 
                  variant: error ? "error" : variant, 
                  size: size as "sm" | "md" | "lg" | undefined 
                }),
                className
              )}
              style={{
                borderRadius: '0.25rem',
                outlineOffset: '0',
                outline: 'none',
                height: size === 'sm' ? '0.75rem' : size === 'lg' ? '1.25rem' : '1rem',
                width: size === 'sm' ? '0.75rem' : size === 'lg' ? '1.25rem' : '1rem',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: error ? '#EF4444' : 
                              variant === 'success' ? '#10B981' : 
                              variant === 'warning' ? '#F59E0B' : '#CBD5E1',
                color: error ? '#EF4444' : 
                       variant === 'success' ? '#10B981' : 
                       variant === 'warning' ? '#F59E0B' : '#3B82F6',
                appearance: 'none',
                position: 'relative',
              }}
              ref={ref}
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm" style={{ marginLeft: '0.75rem', fontSize: '0.875rem' }}>
              {label && (
                <label className={cn("font-medium text-neutral-800", labelClassName)} style={{ fontWeight: 500, color: '#1E293B' }}>
                  {label}
                </label>
              )}
              {description && (
                <p className={cn("text-neutral-600", descriptionClassName)} style={{ color: '#475569' }}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-destructive mt-1" style={{ fontSize: '0.875rem', color: '#EF4444', marginTop: '0.25rem' }}>{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
