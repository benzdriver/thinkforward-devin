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
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label className={cn("block text-sm font-medium text-neutral-800 mb-1.5", labelClassName)}>
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
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
