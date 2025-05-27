import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { baseVariants, componentVariants } from "../../lib/theme/variants";

const cardVariants = cva(
  "rounded-xl overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
        feature: "border border-primary-100 bg-white shadow-colored dark:border-primary-800 dark:bg-neutral-800 dark:text-neutral-100",
        destructive: "border border-destructive-100 bg-white shadow-sm dark:border-destructive-800 dark:bg-neutral-800 dark:text-neutral-100",
        success: "border border-success-100 bg-white shadow-sm dark:border-success-800 dark:bg-neutral-800 dark:text-neutral-100",
        warning: "border border-warning-100 bg-white shadow-sm dark:border-warning-800 dark:bg-neutral-800 dark:text-neutral-100",
        neutral: "border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
        elevated: "border border-neutral-100 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
        flat: "border-none bg-white shadow-none dark:bg-neutral-800 dark:text-neutral-100",
        gradient: "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-colored dark:from-primary-600 dark:to-primary-800",
        accent: "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-colored dark:from-primary-600 dark:to-primary-800",
        glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-md dark:bg-neutral-900/80 dark:border-neutral-700/30 dark:text-neutral-100",
      },
      hover: componentVariants.card.hover,
      bordered: componentVariants.card.bordered,
      rounded: baseVariants.rounded,
    },
    defaultVariants: {
      variant: "default",
      hover: false,
      bordered: true,
      rounded: "xl",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, bordered, rounded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, bordered, rounded, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight text-lg font-display dark:text-neutral-100", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
