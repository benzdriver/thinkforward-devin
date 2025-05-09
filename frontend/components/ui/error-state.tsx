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
      variant,
      size,
      fullHeight,
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
          })}>
            {title}
          </h3>
        )}
        
        {errorCode && (
          <div className={cn("text-destructive-600 font-mono", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}>
            {typeof errorCode === 'number' ? `错误代码: ${errorCode}` : errorCode}
          </div>
        )}
        
        {description && (
          <p className={cn("text-neutral-600", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}>
            {description}
          </p>
        )}
        
        {retryAction && (
          <div className="mt-4">
            {retryAction}
          </div>
        )}
        
        {secondaryAction && (
          <div className="mt-2">
            {secondaryAction}
          </div>
        )}
        
        {errorDetails && (
          <div className="w-full mt-4">
            <button
              type="button"
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
              className={cn("text-xs text-neutral-500 underline hover:text-neutral-700 focus:outline-none", {
                "mb-2": isDetailsVisible,
              })}
            >
              {isDetailsVisible ? "隐藏详细信息" : "显示详细信息"}
            </button>
            
            {isDetailsVisible && (
              <pre className="w-full p-2 mt-1 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded overflow-x-auto text-left">
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
