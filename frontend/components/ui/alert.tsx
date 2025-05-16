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
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem', color: '#3B82F6' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "success":
      return (
        <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem', color: '#16A34A' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case "warning":
      return (
        <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem', color: '#D97706' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "error":
      return (
        <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem', color: '#EF4444' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case "neutral":
      return (
        <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem', color: '#64748B' }}>
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
    variant = "info", 
    size = "md",
    title, 
    dismissible = false, 
    onDismiss, 
    icon,
    children, 
    ...props 
  }, ref) => {
    const defaultIcon = getDefaultIcon(variant);
    const alertIcon = icon || defaultIcon;
    
    const alertStyle: React.CSSProperties = {
      position: 'relative',
      borderRadius: '0.375rem',
      border: '1px solid',
      padding: size === 'sm' ? '0.75rem' : 
               size === 'md' ? '1rem' : 
               size === 'lg' ? '1.25rem' : '1rem',
      fontSize: size === 'sm' ? '0.75rem' : 
                size === 'md' ? '0.875rem' : 
                size === 'lg' ? '1rem' : '0.875rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      info: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E3A8A' },
      success: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', color: '#14532D' },
      warning: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#78350F' },
      error: { backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#7F1D1D' },
      neutral: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' },
    };
    
    const combinedAlertStyle = {
      ...alertStyle,
      ...(variantStyles[variant as string] || variantStyles.info),
    };
    
    const flexContainerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
    };
    
    const iconContainerStyle: React.CSSProperties = {
      flexShrink: 0,
      marginRight: '0.75rem',
    };
    
    const contentContainerStyle: React.CSSProperties = {
      flex: 1,
    };
    
    const titleStyle: React.CSSProperties = {
      fontWeight: 500,
      marginBottom: '0.25rem',
    };
    
    const contentStyle: React.CSSProperties = {
      color: '#374151',
    };
    
    const dismissButtonStyle: React.CSSProperties = {
      marginLeft: 'auto',
      marginRight: '-0.375rem',
      marginTop: '-0.375rem',
      backgroundColor: 'transparent',
      color: '#64748B',
      padding: '0.375rem',
      display: 'inline-flex',
      height: '2rem',
      width: '2rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
    };
    
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant, size }), className)}
        role="alert"
        style={combinedAlertStyle}
        {...props}
      >
        <div className="flex items-start" style={flexContainerStyle}>
          {alertIcon && (
            <div className="flex-shrink-0 mr-3" style={iconContainerStyle}>{alertIcon}</div>
          )}
          <div className="flex-1" style={contentContainerStyle}>
            {title && (
              <h5 className="font-medium mb-1" style={titleStyle}>{title}</h5>
            )}
            <div className="text-neutral-700" style={contentStyle}>{children}</div>
          </div>
          {dismissible && onDismiss && (
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-neutral-500 hover:text-neutral-700 p-1.5 inline-flex h-8 w-8 rounded-md focus:ring-2 focus:ring-primary-400 focus:outline-none"
              onClick={onDismiss}
              aria-label="Dismiss"
              style={dismissButtonStyle}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ height: '1.25rem', width: '1.25rem' }}>
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
