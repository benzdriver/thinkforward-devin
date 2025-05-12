import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const toggleVariants = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 data-[state=checked]:bg-primary",
        success: "bg-neutral-200 data-[state=checked]:bg-success",
        warning: "bg-neutral-200 data-[state=checked]:bg-warning",
        destructive: "bg-neutral-200 data-[state=checked]:bg-destructive",
      },
      size: {
        sm: "h-4 w-8",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-4",
        md: "h-5 w-5 data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof toggleVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    className,
    variant,
    size,
    checked,
    defaultChecked,
    onCheckedChange,
    label,
    description,
    error,
    containerClassName,
    labelClassName,
    descriptionClassName,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    
    const handleToggle = () => {
      const newState = !isChecked;
      setIsChecked(newState);
      onCheckedChange?.(newState);
    };
    
    const state = checked !== undefined ? checked : isChecked;
    
    return (
      <div className={cn("space-y-2", containerClassName)}>
        <div className="flex items-center justify-between">
          {(label || description) && (
            <div className="flex flex-col mr-3">
              {label && (
                <span className={cn("text-sm font-medium text-neutral-800", labelClassName)}>
                  {label}
                </span>
              )}
              {description && (
                <span className={cn("text-sm text-neutral-600", descriptionClassName)}>
                  {description}
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            role="switch"
            aria-checked={state}
            data-state={state ? "checked" : "unchecked"}
            className={cn(toggleVariants({ variant, size }), className)}
            onClick={handleToggle}
            ref={ref}
            {...props}
          >
            <span 
              data-state={state ? "checked" : "unchecked"}
              className={cn(
                thumbVariants({ size }),
                state ? "translate-x-5" : "translate-x-1",
                size === "sm" && state ? "translate-x-4" : size === "sm" ? "translate-x-0.5" : "",
                size === "lg" && state ? "translate-x-7" : size === "lg" ? "translate-x-1" : ""
              )}
            />
          </button>
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
