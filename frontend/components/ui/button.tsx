import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm",
        secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 shadow-sm",
        outline: "border border-secondary-200 bg-transparent text-foreground hover:bg-secondary-50 active:bg-secondary-100",
        ghost: "bg-transparent text-foreground hover:bg-secondary-50 active:bg-secondary-100",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-700",
        destructive: "bg-destructive text-white hover:bg-destructive-600 active:bg-destructive-700 shadow-sm",
        success: "bg-success text-white hover:bg-success-600 active:bg-success-700 shadow-sm",
        warning: "bg-warning text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm",
        neutral: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400 shadow-sm",
      },
      size: {
        xs: "h-7 rounded px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 rounded-md px-4 py-2",
        lg: "h-12 rounded-md px-6 py-3 text-base",
        xl: "h-14 rounded-md px-8 py-4 text-lg",
        icon: "h-9 w-9 rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    const baseStyle = { 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: '0.375rem', 
      fontSize: '0.875rem', 
      fontWeight: 500,
      transition: 'all 0.2s',
      cursor: 'pointer',
      outline: 'none',
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: '#4A6CF7', color: 'white', border: 'none' },
      secondary: { backgroundColor: '#F1F5F9', color: '#334155', border: 'none' },
      outline: { backgroundColor: 'transparent', color: '#0F172A', border: '1px solid #E2E8F0' },
      ghost: { backgroundColor: 'transparent', color: '#0F172A', border: 'none' },
      link: { backgroundColor: 'transparent', color: '#4A6CF7', border: 'none', textDecoration: 'underline' },
      destructive: { backgroundColor: '#EF4444', color: 'white', border: 'none' },
      success: { backgroundColor: '#10B981', color: 'white', border: 'none' },
      warning: { backgroundColor: '#F59E0B', color: 'white', border: 'none' },
      neutral: { backgroundColor: '#E2E8F0', color: '#475569', border: 'none' },
    };
    
    const sizeStyles: Record<string, React.CSSProperties> = {
      xs: { height: '1.75rem', padding: '0 0.5rem', fontSize: '0.75rem' },
      sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.75rem' },
      md: { height: '2.5rem', padding: '0 1rem', fontSize: '0.875rem' },
      lg: { height: '3rem', padding: '0 1.5rem', fontSize: '1rem' },
      xl: { height: '3.5rem', padding: '0 2rem', fontSize: '1.125rem' },
      icon: { height: '2.25rem', width: '2.25rem', padding: '0' },
    };
    
    const widthStyle = fullWidth ? { width: '100%' } : {};
    
    const inlineStyle = {
      ...baseStyle,
      ...(variantStyles[variant as string] || variantStyles.primary),
      ...(sizeStyles[size as string] || sizeStyles.md),
      ...widthStyle,
    };
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        style={inlineStyle}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
