import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary-100",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
      variant: {
        default: "bg-secondary-100",
        primary: "bg-primary-100",
        secondary: "bg-secondary-100",
        destructive: "bg-destructive-100",
        success: "bg-success-100",
        warning: "bg-warning-100",
        info: "bg-info-100",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all",
  {
    variants: {
      variant: {
        default: "bg-secondary-500",
        primary: "bg-primary-500",
        secondary: "bg-secondary-500",
        destructive: "bg-destructive-500",
        success: "bg-success-500",
        warning: "bg-warning-500",
        info: "bg-info-500",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        indeterminate: "animate-indeterminate-progress",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  showValue?: boolean;
  valuePosition?: "inside" | "outside";
  valueFormat?: (value: number, max: number) => string;
  animation?: VariantProps<typeof progressIndicatorVariants>["animation"];
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant,
      showValue = false,
      valuePosition = "outside",
      valueFormat,
      animation = value !== undefined ? "none" : "indeterminate",
      indicatorClassName,
      ...props
    },
    ref
  ) => {
    const percentage = value !== undefined ? Math.min(Math.max(0, (value / max) * 100), 100) : undefined;
    
    const formattedValue = React.useMemo(() => {
      if (!showValue) return null;
      
      if (valueFormat) {
        return valueFormat(value, max);
      }
      
      if (percentage !== undefined) {
        return `${Math.round(percentage)}%`;
      }
      
      return null;
    }, [showValue, valueFormat, value, max, percentage]);
    
    return (
      <div className="w-full">
        <div className="flex items-center justify-between">
          {props.children && (
            <div className="mb-1 text-sm font-medium">{props.children}</div>
          )}
          {showValue && valuePosition === "outside" && formattedValue && (
            <div className="mb-1 text-sm text-neutral-500">{formattedValue}</div>
          )}
        </div>
        <div
          ref={ref}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={percentage !== undefined ? Math.round(percentage) : undefined}
          aria-valuetext={formattedValue || undefined}
          className={cn(progressVariants({ size, variant }), className)}
          {...props}
        >
          <div
            className={cn(
              progressIndicatorVariants({ variant, animation }),
              indicatorClassName
            )}
            style={{
              width: percentage !== undefined ? `${percentage}%` : "100%",
            }}
          >
            {showValue && valuePosition === "inside" && formattedValue && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {formattedValue}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export interface ProgressStepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: number;
  currentStep: number;
  variant?: VariantProps<typeof progressVariants>["variant"];
  showLabels?: boolean;
  labels?: string[];
  orientation?: "horizontal" | "vertical";
}

const ProgressSteps = React.forwardRef<HTMLDivElement, ProgressStepsProps>(
  (
    {
      className,
      steps,
      currentStep,
      variant = "primary",
      showLabels = false,
      labels,
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    const isVertical = orientation === "vertical";
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          isVertical ? "flex" : "block",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "relative",
            isVertical
              ? "h-full w-1 bg-secondary-100"
              : "h-1 w-full bg-secondary-100"
          )}
        >
          <div
            className={cn(
              "absolute",
              isVertical
                ? "w-1 bg-primary-500"
                : "h-1 bg-primary-500",
              {
                "bg-primary-500": variant === "primary",
                "bg-secondary-500": variant === "secondary",
                "bg-destructive-500": variant === "destructive",
                "bg-success-500": variant === "success",
                "bg-warning-500": variant === "warning",
                "bg-info-500": variant === "info",
              }
            )}
            style={{
              [isVertical ? "height" : "width"]: `${(Math.min(currentStep, steps) / steps) * 100}%`,
            }}
          />
          <div
            className={cn(
              "absolute",
              isVertical ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
              "flex",
              isVertical ? "flex-col h-full" : "w-full"
            )}
          >
            {Array.from({ length: steps }).map((_, index) => {
              const isActive = index < currentStep;
              const isCurrent = index === currentStep - 1;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "relative",
                    isVertical
                      ? "flex-1 flex items-center"
                      : "flex-1 flex flex-col items-center"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-full border-2 flex items-center justify-center",
                      isVertical ? "ml-2" : "mt-0",
                      {
                        "h-6 w-6": isCurrent,
                        "h-4 w-4": !isCurrent,
                        "bg-white border-secondary-300": !isActive,
                        "border-primary-500 bg-primary-500 text-white": isActive && variant === "primary",
                        "border-secondary-500 bg-secondary-500 text-white": isActive && variant === "secondary",
                        "border-destructive-500 bg-destructive-500 text-white": isActive && variant === "destructive",
                        "border-success-500 bg-success-500 text-white": isActive && variant === "success",
                        "border-warning-500 bg-warning-500 text-white": isActive && variant === "warning",
                        "border-info-500 bg-info-500 text-white": isActive && variant === "info",
                      }
                    )}
                  >
                    {isActive && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={cn("h-3 w-3", {
                          "h-4 w-4": isCurrent,
                        })}
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  
                  {showLabels && (
                    <div
                      className={cn(
                        "text-sm",
                        isVertical ? "ml-4" : "mt-2",
                        {
                          "font-medium": isCurrent,
                          "text-neutral-500": !isCurrent,
                        }
                      )}
                    >
                      {labels?.[index] || `Step ${index + 1}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
ProgressSteps.displayName = "ProgressSteps";

export { Progress, ProgressSteps, progressVariants, progressIndicatorVariants };
