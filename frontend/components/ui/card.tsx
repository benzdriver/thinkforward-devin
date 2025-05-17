import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva(
  "rounded-lg border shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-secondary-200 bg-white",
        feature: "border-primary-100 bg-white",
        destructive: "border-destructive-100 bg-white",
        success: "border-success-100 bg-white",
        warning: "border-warning-100 bg-white",
        neutral: "border-neutral-200 bg-white",
        elevated: "border-secondary-100 bg-white shadow-md",
        flat: "border-none bg-white shadow-none",
      },
      hover: {
        true: "transition-shadow hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      borderRadius: '0.5rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      backgroundColor: 'white',
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { borderColor: '#E2E8F0' },
      feature: { borderColor: '#E0E7FF' },
      destructive: { borderColor: '#FEE2E2' },
      success: { borderColor: '#D1FAE5' },
      warning: { borderColor: '#FEF3C7' },
      neutral: { borderColor: '#E2E8F0' },
      elevated: { borderColor: '#F1F5F9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
      flat: { border: 'none', boxShadow: 'none' },
    };
    
    const hoverStyle = hover ? {
      transition: 'box-shadow 0.2s ease-in-out',
    } : {};
    
    const inlineStyle = {
      ...baseStyle,
      ...(variantStyles[variant as string] || variantStyles.default),
      ...hoverStyle,
    };
    
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, className }))}
        style={inlineStyle}
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
    style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', padding: '1.5rem' }}
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
    className={cn("font-semibold leading-none tracking-tight text-lg", className)}
    style={{ fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.025em', fontSize: '1.125rem', color: '#0F172A' }}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    style={{ padding: '1.5rem', paddingTop: 0 }} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', paddingTop: 0 }}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
