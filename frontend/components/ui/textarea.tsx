import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]",
  {
    variants: {
      variant: {
        default: "border-secondary-200 focus:ring-primary-400",
        error: "border-destructive focus:ring-destructive-300",
        success: "border-success-300 focus:ring-success-400",
        warning: "border-warning-300 focus:ring-warning-400",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      resize: "vertical",
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText,
    variant = error ? "error" : "default",
    size,
    resize,
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
        <textarea
          className={cn(
            textareaVariants({ 
              variant, 
              size: size as "sm" | "md" | "lg" | undefined,
              resize 
            }),
            className
          )}
          style={{
            display: 'flex',
            width: '100%',
            minHeight: '80px',
            borderRadius: '0.375rem',
            border: '1px solid',
            borderColor: error ? '#EF4444' : variant === 'success' ? '#10B981' : variant === 'warning' ? '#F59E0B' : '#E2E8F0',
            backgroundColor: 'white',
            padding: size === 'sm' ? '0.25rem 0.5rem' : size === 'lg' ? '0.75rem 1rem' : '0.5rem 0.75rem',
            fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
            resize: resize === 'none' ? 'none' : resize === 'horizontal' ? 'horizontal' : resize === 'both' ? 'both' : 'vertical',
          }}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-destructive" style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#EF4444' }}>{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500" style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#64748B' }}>{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
