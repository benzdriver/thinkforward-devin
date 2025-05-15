import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const errorStateVariants = cva(
  "flex flex-col items-center justify-center text-center p-6 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-white border border-destructive-100",
        subtle: "bg-destructive-50 border border-destructive-100",
        ghost: "bg-transparent",
        critical: "bg-destructive-100 border border-destructive-200",
      },
      size: {
        sm: "p-4 gap-2",
        md: "p-6 gap-3",
        lg: "p-8 gap-4",
      },
      fullHeight: {
        true: "h-full min-h-[300px]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullHeight: false,
    },
  }
);

export interface ErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof errorStateVariants> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  errorCode?: string | number;
  errorDetails?: string;
  retryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  showDetails?: boolean;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      fullHeight = false,
      icon,
      title,
      description,
      errorCode,
      errorDetails,
      retryAction,
      secondaryAction,
      showDetails = false,
      ...props
    },
    ref
  ) => {
    const [isDetailsVisible, setIsDetailsVisible] = React.useState(showDetails);
    
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderRadius: '0.5rem',
      ...(fullHeight ? { height: '100%', minHeight: '300px' } : {}),
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: 'white', border: '1px solid #FEE2E2' },
      subtle: { backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' },
      ghost: { backgroundColor: 'transparent' },
      critical: { backgroundColor: '#FEE2E2', border: '1px solid #FECACA' },
    };
    
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '1rem', gap: '0.5rem' },
      md: { padding: '1.5rem', gap: '0.75rem' },
      lg: { padding: '2rem', gap: '1rem' },
    };
    
    const combinedContainerStyle = {
      ...containerStyle,
      ...(variantStyles[variant as string] || variantStyles.default),
      ...(sizeStyles[size as string] || sizeStyles.md),
    };
    
    const titleStyle: React.CSSProperties = {
      fontWeight: 500,
      color: '#B91C1C',
      fontSize: size === 'sm' ? '0.875rem' : 
               size === 'md' ? '1rem' : 
               size === 'lg' ? '1.125rem' : '1rem',
    };
    
    const errorCodeStyle: React.CSSProperties = {
      color: '#DC2626',
      fontFamily: 'monospace',
      fontSize: size === 'sm' ? '0.75rem' : 
               size === 'md' ? '0.875rem' : 
               size === 'lg' ? '1rem' : '0.875rem',
    };
    
    const descriptionStyle: React.CSSProperties = {
      color: '#4B5563',
      fontSize: size === 'sm' ? '0.75rem' : 
               size === 'md' ? '0.875rem' : 
               size === 'lg' ? '1rem' : '0.875rem',
    };
    
    const actionContainerStyle: React.CSSProperties = {
      marginTop: '1rem',
    };
    
    const secondaryActionContainerStyle: React.CSSProperties = {
      marginTop: '0.5rem',
    };
    
    const detailsContainerStyle: React.CSSProperties = {
      width: '100%',
      marginTop: '1rem',
    };
    
    const detailsToggleStyle: React.CSSProperties = {
      fontSize: '0.75rem',
      color: '#6B7280',
      textDecoration: 'underline',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      marginBottom: isDetailsVisible ? '0.5rem' : 0,
    };
    
    const detailsPreStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.5rem',
      marginTop: '0.25rem',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      backgroundColor: '#F9FAFB',
      border: '1px solid #E5E7EB',
      borderRadius: '0.25rem',
      overflowX: 'auto',
      textAlign: 'left',
    };
    
    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-destructive-500"
        style={{ color: '#EF4444' }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(
          errorStateVariants({
            variant,
            size,
            fullHeight,
          }),
          className
        )}
        style={combinedContainerStyle}
        role="alert"
        aria-live="assertive"
        {...props}
      >
        {icon || defaultIcon}
        
        {title && (
          <h3 className={cn("font-medium text-destructive-700", {
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-lg": size === "lg",
          })}
          style={titleStyle}>
            {title}
          </h3>
        )}
        
        {errorCode && (
          <div className={cn("text-destructive-600 font-mono", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}
          style={errorCodeStyle}>
            {typeof errorCode === 'number' ? `Error code: ${errorCode}` : errorCode}
          </div>
        )}
        
        {description && (
          <p className={cn("text-neutral-600", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}
          style={descriptionStyle}>
            {description}
          </p>
        )}
        
        {retryAction && (
          <div className="mt-4" style={actionContainerStyle}>
            {retryAction}
          </div>
        )}
        
        {secondaryAction && (
          <div className="mt-2" style={secondaryActionContainerStyle}>
            {secondaryAction}
          </div>
        )}
        
        {errorDetails && (
          <div className="w-full mt-4" style={detailsContainerStyle}>
            <button
              type="button"
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
              className={cn("text-xs text-neutral-500 underline hover:text-neutral-700 focus:outline-none", {
                "mb-2": isDetailsVisible,
              })}
              style={detailsToggleStyle}
            >
              {isDetailsVisible ? "Hide details" : "Show details"}
            </button>
            
            {isDetailsVisible && (
              <pre className="w-full p-2 mt-1 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded overflow-x-auto text-left"
                  style={detailsPreStyle}>
                {errorDetails}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  }
);
ErrorState.displayName = "ErrorState";

export { ErrorState, errorStateVariants };
