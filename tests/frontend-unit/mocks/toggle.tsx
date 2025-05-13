import React from 'react';

export interface ToggleProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    className = '',
    variant = 'default',
    size = 'md',
    checked,
    defaultChecked,
    onCheckedChange,
    label,
    description,
    error,
    containerClassName = '',
    labelClassName = '',
    descriptionClassName = '',
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
      <div className={`space-y-2 ${containerClassName}`}>
        <div className="flex items-center justify-between">
          {(label || description) && (
            <div className="flex flex-col mr-3">
              {label && (
                <span className={`text-sm font-medium text-neutral-800 ${labelClassName}`}>
                  {label}
                </span>
              )}
              {description && (
                <span className={`text-sm text-neutral-600 ${descriptionClassName}`}>
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
              ${variant === 'default' ? 'bg-neutral-200 data-[state=checked]:bg-primary' : ''}
              ${variant === 'success' ? 'bg-neutral-200 data-[state=checked]:bg-success' : ''}
              ${variant === 'warning' ? 'bg-neutral-200 data-[state=checked]:bg-warning' : ''}
              ${variant === 'destructive' ? 'bg-neutral-200 data-[state=checked]:bg-destructive' : ''}
              ${size === 'sm' ? 'h-4 w-8' : ''}
              ${size === 'md' ? 'h-6 w-11' : ''}
              ${size === 'lg' ? 'h-7 w-14' : ''}
              ${className}`}
            onClick={handleToggle}
            ref={ref}
            {...props}
          >
            <span 
              data-state={state ? "checked" : "unchecked"}
              className={`pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform
                ${size === 'sm' ? 'h-3 w-3' : ''}
                ${size === 'md' ? 'h-5 w-5' : ''}
                ${size === 'lg' ? 'h-6 w-6' : ''}
                ${state ? (
                  size === 'sm' ? 'translate-x-4' : 
                  size === 'lg' ? 'translate-x-7' : 
                  'translate-x-5'
                ) : (
                  size === 'sm' ? 'translate-x-0.5' : 
                  size === 'lg' ? 'translate-x-1' : 
                  'translate-x-1'
                )}`}
            />
          </button>
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);
Toggle.displayName = "Toggle";
