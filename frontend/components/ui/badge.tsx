import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-neutral-50 text-neutral-800 ring-neutral-200 hover:bg-neutral-100",
        primary: "bg-primary-50 text-primary-800 ring-primary-200 hover:bg-primary-100",
        secondary: "bg-secondary-50 text-secondary-800 ring-secondary-200 hover:bg-secondary-100",
        destructive: "bg-destructive-50 text-destructive-800 ring-destructive-200 hover:bg-destructive-100",
        success: "bg-success-50 text-success-800 ring-success-200 hover:bg-success-100",
        warning: "bg-warning-50 text-warning-800 ring-warning-200 hover:bg-warning-100",
        info: "bg-info-50 text-info-800 ring-info-200 hover:bg-info-100",
        outline: "bg-transparent text-neutral-800 ring-neutral-300 hover:bg-neutral-50",
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
  ({ className, variant = "default", size = "md", interactive, removable, icon, onRemove, children, ...props }, ref) => {
    const isRemovable = onRemove ? true : removable;
    
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '9999px',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: 500,
      border: '1px solid',
    };
    
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: '#F8FAFC', color: '#1E293B', borderColor: '#E2E8F0' },
      primary: { backgroundColor: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' },
      secondary: { backgroundColor: '#F1F5F9', color: '#334155', borderColor: '#CBD5E1' },
      destructive: { backgroundColor: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' },
      success: { backgroundColor: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' },
      warning: { backgroundColor: '#FFFBEB', color: '#92400E', borderColor: '#FDE68A' },
      info: { backgroundColor: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE' },
      outline: { backgroundColor: 'transparent', color: '#1E293B', borderColor: '#CBD5E1' },
    };
    
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '0.125rem 0.5rem', fontSize: '0.625rem' },
      md: { padding: '0.25rem 0.625rem', fontSize: '0.75rem' },
      lg: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    };
    
    const interactiveStyle = (interactive || !!onRemove) ? {
      cursor: 'pointer',
      transition: 'all 0.2s',
    } : {};
    
    const removableStyle = isRemovable ? {
      paddingRight: '0.25rem',
    } : {};
    
    const inlineStyle = {
      ...baseStyle,
      ...(variantStyles[variant as string] || variantStyles.default),
      ...(sizeStyles[size as string] || sizeStyles.md),
      ...interactiveStyle,
      ...removableStyle,
    };
    
    const iconStyle: React.CSSProperties = {
      marginRight: '0.25rem',
      marginLeft: '-0.125rem',
      display: 'inline-flex',
    };
    
    const removeButtonStyle: React.CSSProperties = {
      marginLeft: '0.25rem',
      marginRight: '-0.125rem',
      display: 'inline-flex',
      height: '1rem',
      width: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    };
    
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
        style={inlineStyle}
        {...props}
      >
        {icon && <span className="mr-1 -ml-0.5 inline-flex" style={iconStyle}>{icon}</span>}
        {children}
        {isRemovable && onRemove && (
          <button
            type="button"
            className="ml-1 -mr-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-neutral-200/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0"
            style={removeButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3 w-3"
              style={{ height: '0.75rem', width: '0.75rem' }}
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
