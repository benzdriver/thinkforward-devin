import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center p-6 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-white border border-secondary-200",
        subtle: "bg-secondary-50 border border-secondary-100",
        ghost: "bg-transparent",
        card: "bg-white border border-secondary-200 shadow-sm",
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

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      fullHeight = false,
      icon,
      title,
      description,
      action,
      secondaryAction,
      footer,
      isLoading = false,
      ...props
    },
    ref
  ) => {
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
      default: { backgroundColor: 'white', border: '1px solid #E2E8F0' },
      subtle: { backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' },
      ghost: { backgroundColor: 'transparent' },
      card: { backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
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
      fontSize: size === 'sm' ? '0.875rem' : 
               size === 'md' ? '1rem' : 
               size === 'lg' ? '1.125rem' : '1rem',
    };
    
    const descriptionStyle: React.CSSProperties = {
      color: '#64748B',
      fontSize: size === 'sm' ? '0.75rem' : 
               size === 'md' ? '0.875rem' : 
               size === 'lg' ? '1rem' : '0.875rem',
    };
    
    const actionContainerStyle: React.CSSProperties = {
      marginTop: '0.5rem',
    };
    
    const footerStyle: React.CSSProperties = {
      marginTop: size === 'sm' ? '0.5rem' : 
                size === 'md' ? '1rem' : 
                size === 'lg' ? '1.5rem' : '1rem',
      fontSize: size === 'lg' ? '0.875rem' : '0.75rem',
      color: '#94A3B8',
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
        className="text-secondary-400"
        style={{ color: '#94A3B8' }}
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9.5 15v-6h1.5L9.5 15" />
        <path d="M14.5 9h-3v6h3" />
        <path d="M11.5 12h2" />
      </svg>
    );

    const loadingIcon = (
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
        className="animate-spin text-primary"
        style={{ color: '#3B82F6', animation: 'spin 1s linear infinite' }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(
          emptyStateVariants({
            variant,
            size,
            fullHeight,
          }),
          className
        )}
        style={combinedContainerStyle}
        {...props}
      >
        {isLoading ? loadingIcon : icon || defaultIcon}
        
        {title && (
          <h3 className={cn("font-medium", {
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-lg": size === "lg",
          })}
          style={titleStyle}>
            {isLoading ? "Loading..." : title}
          </h3>
        )}
        
        {description && (
          <p className={cn("text-neutral-500", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}
          style={descriptionStyle}>
            {isLoading ? "Please wait..." : description}
          </p>
        )}
        
        {!isLoading && action && (
          <div className="mt-2" style={actionContainerStyle}>
            {action}
          </div>
        )}
        
        {!isLoading && secondaryAction && (
          <div className="mt-2" style={actionContainerStyle}>
            {secondaryAction}
          </div>
        )}
        
        {!isLoading && footer && (
          <div className={cn("mt-4 text-xs text-neutral-400", {
            "mt-2 text-xs": size === "sm",
            "mt-4 text-xs": size === "md",
            "mt-6 text-sm": size === "lg",
          })}
          style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState, emptyStateVariants };
