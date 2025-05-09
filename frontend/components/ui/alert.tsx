import * as React from "react";
import { cn } from "../../lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const alertVariants = {
  info: {
    bg: 'bg-primary-50',
    border: 'border-primary-100',
    text: 'text-primary-900',
    icon: (
      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-800',
    icon: (
      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    text: 'text-yellow-800',
    icon: (
      <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-destructive-50',
    border: 'border-destructive-100',
    text: 'text-destructive-900',
    icon: (
      <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, dismissible = false, onDismiss, children, ...props }, ref) => {
    const { bg, border, text, icon } = alertVariants[variant];
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-md border p-4 shadow-sm",
          bg,
          border,
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">{icon}</div>
          <div className="flex-1">
            {title && (
              <h5 className={cn("text-sm font-medium mb-1", text)}>{title}</h5>
            )}
            <div className="text-sm text-dark-gray">{children}</div>
          </div>
          {dismissible && onDismiss && (
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-dark-gray hover:text-foreground p-1.5 inline-flex h-8 w-8 rounded-md focus:ring-2 focus:ring-primary"
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

export { Alert };
