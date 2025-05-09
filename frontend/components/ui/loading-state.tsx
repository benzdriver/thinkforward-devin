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
      variant,
      size,
      fullHeight,
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
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );

    const progressBar = hasProgress && showProgressBar && (
      <div className="w-full max-w-xs bg-secondary-100 rounded-full h-2.5 mt-2">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    );

    const progressText = hasProgress && (
      <span className="text-xs text-neutral-500 mt-1">
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
          })}>
            {title}
          </h3>
        )}
        
        {description && (
          <p className={cn("text-neutral-500", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}>
            {description}
          </p>
        )}
        
        {progressBar}
        {progressText}
        
        <span className="sr-only">加载中...</span>
      </div>
    );
  }
);
LoadingState.displayName = "LoadingState";

export { LoadingState, loadingStateVariants };
