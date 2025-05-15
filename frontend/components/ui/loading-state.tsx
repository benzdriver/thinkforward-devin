import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const loadingStateVariants = cva(
  "flex flex-col items-center justify-center text-center p-6 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-white border border-secondary-200",
        subtle: "bg-secondary-50 border border-secondary-100",
        ghost: "bg-transparent",
        overlay: "absolute inset-0 bg-white/80 backdrop-blur-sm z-50",
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

export interface LoadingStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof loadingStateVariants> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  progress?: number;
  showProgressBar?: boolean;
  showSpinner?: boolean;
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      fullHeight = false,
      icon,
      title,
      description,
      progress,
      showProgressBar = false,
      showSpinner = true,
      ...props
    },
    ref
  ) => {
    const hasProgress = typeof progress === 'number' && progress >= 0 && progress <= 100;
    
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
      overlay: { 
        position: 'absolute', 
        inset: 0, 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(4px)',
        zIndex: 50 
      },
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
    
    const progressBarContainerStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: '20rem',
      backgroundColor: '#E2E8F0',
      borderRadius: '9999px',
      height: '0.625rem',
      marginTop: '0.5rem',
    };
    
    const progressBarIndicatorStyle: React.CSSProperties = {
      backgroundColor: '#3B82F6',
      height: '0.625rem',
      borderRadius: '9999px',
      transition: 'width 0.3s ease-in-out',
      width: `${progress}%`,
    };
    
    const progressTextStyle: React.CSSProperties = {
      fontSize: '0.75rem',
      color: '#64748B',
      marginTop: '0.25rem',
    };
    
    const defaultSpinner = (
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

    const progressBar = hasProgress && showProgressBar && (
      <div className="w-full max-w-xs bg-secondary-100 rounded-full h-2.5 mt-2" style={progressBarContainerStyle}>
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={progressBarIndicatorStyle}
        />
      </div>
    );

    const progressText = hasProgress && (
      <span className="text-xs text-neutral-500 mt-1" style={progressTextStyle}>
        {Math.round(progress)}%
      </span>
    );

    return (
      <div
        ref={ref}
        className={cn(
          loadingStateVariants({
            variant,
            size,
            fullHeight,
          }),
          className
        )}
        style={combinedContainerStyle}
        role="status"
        aria-live="polite"
        {...props}
      >
        {showSpinner && (icon || defaultSpinner)}
        
        {title && (
          <h3 className={cn("font-medium", {
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-lg": size === "lg",
          })}
          style={titleStyle}>
            {title}
          </h3>
        )}
        
        {description && (
          <p className={cn("text-neutral-500", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}
          style={descriptionStyle}>
            {description}
          </p>
        )}
        
        {progressBar}
        {progressText}
        
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
LoadingState.displayName = "LoadingState";

export { LoadingState, loadingStateVariants };
