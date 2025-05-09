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
      variant,
      size,
      fullHeight,
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
        {...props}
      >
        {isLoading ? loadingIcon : icon || defaultIcon}
        
        {title && (
          <h3 className={cn("font-medium", {
            "text-sm": size === "sm",
            "text-base": size === "md",
            "text-lg": size === "lg",
          })}>
            {isLoading ? "加载中..." : title}
          </h3>
        )}
        
        {description && (
          <p className={cn("text-neutral-500", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
            "text-base": size === "lg",
          })}>
            {isLoading ? "请稍候..." : description}
          </p>
        )}
        
        {!isLoading && action && (
          <div className="mt-2">
            {action}
          </div>
        )}
        
        {!isLoading && secondaryAction && (
          <div className="mt-2">
            {secondaryAction}
          </div>
        )}
        
        {!isLoading && footer && (
          <div className={cn("mt-4 text-xs text-neutral-400", {
            "mt-2 text-xs": size === "sm",
            "mt-4 text-xs": size === "md",
            "mt-6 text-sm": size === "lg",
          })}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState, emptyStateVariants };
