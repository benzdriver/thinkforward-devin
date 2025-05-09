import * as React from "react";
import { cn } from "../../lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            className={cn(
              "h-4 w-4 border-secondary-300 text-primary focus:ring-primary-400",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label className="font-medium text-foreground">{label}</label>
            )}
            {description && (
              <p className="text-dark-gray">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Radio };
