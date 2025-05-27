import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { baseVariants, componentVariants } from "../../lib/theme/variants";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-neutral-50 text-neutral-800 ring-neutral-200 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-700",
        primary: "bg-primary-50 text-primary-800 ring-primary-200 hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-200 dark:ring-primary-800 dark:hover:bg-primary-800",
        secondary: "bg-secondary-50 text-secondary-800 ring-secondary-200 hover:bg-secondary-100 dark:bg-secondary-900 dark:text-secondary-200 dark:ring-secondary-800 dark:hover:bg-secondary-800",
        destructive: "bg-destructive-50 text-destructive-800 ring-destructive-200 hover:bg-destructive-100 dark:bg-destructive-900 dark:text-destructive-200 dark:ring-destructive-800 dark:hover:bg-destructive-800",
        success: "bg-success-50 text-success-800 ring-success-200 hover:bg-success-100 dark:bg-success-900 dark:text-success-200 dark:ring-success-800 dark:hover:bg-success-800",
        warning: "bg-warning-50 text-warning-800 ring-warning-200 hover:bg-warning-100 dark:bg-warning-900 dark:text-warning-200 dark:ring-warning-800 dark:hover:bg-warning-800",
        info: "bg-info-50 text-info-800 ring-info-200 hover:bg-info-100 dark:bg-info-900 dark:text-info-200 dark:ring-info-800 dark:hover:bg-info-800",
        outline: "bg-transparent text-neutral-800 ring-neutral-300 hover:bg-neutral-50 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      interactive: {
        true: "cursor-pointer transition-colors",
        false: "",
      },
      removable: {
        true: "pr-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
      removable: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, interactive, removable, icon, onRemove, children, ...props }, ref) => {
    const isRemovable = onRemove ? true : removable;
    
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ 
            variant, 
            size, 
            interactive: interactive || !!onRemove, 
            removable: isRemovable 
          }),
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1 -ml-0.5 inline-flex">{icon}</span>}
        {children}
        {isRemovable && onRemove && (
          <button
            type="button"
            className="ml-1 -mr-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-neutral-200/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 dark:hover:bg-neutral-700/50 dark:focus:ring-primary-500"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="移除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
