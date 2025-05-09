import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm text-foreground ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dark-gray focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
