import * as React from "react";
import { cn } from "../../lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
  error?: string;
}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-secondary-200 bg-white px-3 py-2 text-sm text-foreground ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dark-gray focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive-300",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
Dropdown.displayName = "Dropdown";

export { Dropdown };
