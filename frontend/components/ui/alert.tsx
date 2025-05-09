import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva(
  "relative rounded-md border p-4 shadow-sm",
  {
    variants: {
      variant: {
        info: "bg-primary-50 border-primary-100 text-primary-900",
        success: "bg-success-50 border-success-100 text-success-900",
        warning: "bg-warning-50 border-warning-100 text-warning-900",
        error: "bg-destructive-50 border-destructive-100 text-destructive-900",
        neutral: "bg-neutral-50 border-neutral-100 text-neutral-900",
      },
      size: {
        sm: "p-3 text-xs",
        md: "p-4 text-sm",
        lg: "p-5 text-base",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

export interface AlertProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const getDefaultIcon = (variant: "info" | "success" | "warning" | "error" | "neutral" | null | undefined) => {
  switch (variant) {
    case "info":
      return (
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "success":
      return (
        <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case "warning":
      return (
        <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "error":
      return (
        <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case "neutral":
      return (
        <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant, 
    size,
    title, 
    dismissible = false, 
    onDismiss, 
    icon,
    children, 
    ...props 
  }, ref) => {
    const defaultIcon = getDefaultIcon(variant);
    const alertIcon = icon || defaultIcon;
    
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant, size }), className)}
        role="alert"
        {...props}
      >
        <div className="flex items-start">
          {alertIcon && (
            <div className="flex-shrink-0 mr-3">{alertIcon}</div>
          )}
          <div className="flex-1">
            {title && (
              <h5 className="font-medium mb-1">{title}</h5>
            )}
            <div className="text-neutral-700">{children}</div>
          </div>
          {dismissible && onDismiss && (
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-neutral-500 hover:text-neutral-700 p-1.5 inline-flex h-8 w-8 rounded-md focus:ring-2 focus:ring-primary-400 focus:outline-none"
              onClick={onDismiss}
              aria-label="Dismiss"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
