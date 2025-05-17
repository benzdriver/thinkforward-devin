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
      <div className={cn("w-full", containerClassName)} style={{ width: '100%' }}>
        {label && (
          <label className={cn("block text-sm font-medium text-neutral-800 mb-1.5", labelClassName)} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1E293B', marginBottom: '0.375rem' }}>
            {label}
          </label>
        )}
        <div className="relative" style={{ position: 'relative' }}>
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
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
            style={{
              display: 'flex',
              width: fullWidth ? '100%' : 'auto',
              borderRadius: '0.375rem',
              border: '1px solid',
              borderColor: error ? '#EF4444' : variant === 'success' ? '#10B981' : variant === 'warning' ? '#F59E0B' : '#E2E8F0',
              backgroundColor: 'white',
              padding: size === 'sm' ? '0.25rem 0.5rem' : size === 'lg' ? '0.75rem 1rem' : '0.5rem 0.75rem',
              fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
              height: size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem',
              paddingLeft: startIcon ? '2.25rem' : (size === 'sm' ? '0.5rem' : size === 'lg' ? '1rem' : '0.75rem'),
              paddingRight: endIcon ? '2.25rem' : (size === 'sm' ? '0.5rem' : size === 'lg' ? '1rem' : '0.75rem'),
              color: error ? '#EF4444' : 
                     variant === 'success' ? '#10B981' : 
                     variant === 'warning' ? '#F59E0B' : '#0F172A',
            }}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
                style={{
                  color: '#0F172A',
                  opacity: option.disabled ? 0.5 : 1,
                }}
              >
                {option.label}
              </option>
            ))}
          </select>
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }}>
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-destructive" style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#EF4444' }}>{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500" style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#64748B' }}>{helperText}</p>}
      </div>
    );
  }
);
Dropdown.displayName = "Dropdown";

export { Dropdown, dropdownVariants };
