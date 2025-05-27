import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { baseVariants, componentVariants } from "../../lib/theme/variants";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-colored hover:shadow-colored-lg transform hover:-translate-y-0.5 dark:bg-primary-700 dark:hover:bg-primary-600 dark:active:bg-primary-500 dark:shadow-none",
        secondary: "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:active:bg-neutral-600",
        outline: "border border-neutral-200 bg-transparent text-foreground hover:bg-neutral-50 active:bg-neutral-100 hover:border-neutral-300 transform hover:-translate-y-0.5 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 dark:hover:border-neutral-600",
        ghost: "bg-transparent text-foreground hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:active:bg-neutral-700",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
        destructive: "bg-gradient-destructive text-white hover:bg-destructive-600 active:bg-destructive-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 dark:bg-destructive-700 dark:hover:bg-destructive-600 dark:active:bg-destructive-500",
        success: "bg-gradient-success text-white hover:bg-success-600 active:bg-success-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 dark:bg-success-700 dark:hover:bg-success-600 dark:active:bg-success-500",
        warning: "bg-gradient-warning text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 dark:bg-warning-700 dark:hover:bg-warning-600 dark:active:bg-warning-500",
        neutral: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:active:bg-neutral-500",
        accent: "bg-gradient-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-colored hover:shadow-colored-lg transform hover:-translate-y-0.5 dark:bg-primary-700 dark:hover:bg-primary-600 dark:active:bg-primary-500 dark:shadow-none",
        glass: "bg-white/80 backdrop-blur-md border border-white/20 text-neutral-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 dark:bg-neutral-900/80 dark:text-neutral-100 dark:border-neutral-700/30",
      },
      size: {
        xs: "h-7 rounded-lg px-2.5 text-xs",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        md: "h-10 rounded-lg px-4 py-2",
        lg: "h-12 rounded-lg px-6 py-3 text-base",
        xl: "h-14 rounded-lg px-8 py-4 text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
      withIcon: {
        true: "inline-flex items-center gap-2",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
      withIcon: false,
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, withIcon, rounded, leftIcon, rightIcon, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, withIcon, rounded, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
