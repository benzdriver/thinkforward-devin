import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-secondary-200 focus:ring-primary-400",
        error: "border-destructive focus:ring-destructive-300",
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
    size = "md",
    fullWidth = true,
    startIcon,
    endIcon,
    containerClassName,
    labelClassName,
    ...props 
  }, ref) => {
    const containerStyle: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      marginBottom: '8px',
    };
    
    const labelStyle: React.CSSProperties = {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.375rem',
      color: '#1E293B',
    };
    
    const inputBaseStyle: React.CSSProperties = {
      display: 'flex',
      width: fullWidth ? '100%' : 'auto',
      borderRadius: '0.375rem',
      border: '1px solid #E2E8F0',
      backgroundColor: 'white',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      outline: 'none',
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { borderColor: '#E2E8F0' },
      error: { borderColor: '#EF4444' },
      success: { borderColor: '#10B981' },
      warning: { borderColor: '#F59E0B' },
    };
    
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { height: '2rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
      md: { height: '2.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
      lg: { height: '3rem', padding: '0.75rem 1rem', fontSize: '1rem' },
    };
    
    const errorTextStyle: React.CSSProperties = {
      marginTop: '0.375rem',
      fontSize: '0.875rem',
      color: '#EF4444',
    };
    
    const helperTextStyle: React.CSSProperties = {
      marginTop: '0.375rem',
      fontSize: '0.875rem',
      color: '#64748B',
    };
    
    const inputStyle = {
      ...inputBaseStyle,
      ...(variantStyles[variant as string] || variantStyles.default),
      ...(sizeStyles[size as string] || sizeStyles.md),
      paddingLeft: startIcon ? '2.25rem' : '0.75rem',
      paddingRight: endIcon ? '2.25rem' : '0.75rem',
    };
    
    return (
      <div className={cn("w-full", containerClassName)} style={containerStyle}>
        {label && (
          <label className={cn("block text-sm font-medium text-neutral-800 mb-1.5", labelClassName)} style={labelStyle}>
            {label}
          </label>
        )}
        <div className="relative" style={{ position: 'relative' }}>
          {startIcon && (
            <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>
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
            style={inputStyle}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }}>
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-destructive" style={errorTextStyle}>{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500" style={helperTextStyle}>{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
