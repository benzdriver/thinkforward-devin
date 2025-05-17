import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const selectVariants = cva(
  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-secondary-200 focus-visible:ring-primary-400",
        error: "border-destructive focus-visible:ring-destructive-300",
        success: "border-success-300 focus-visible:ring-success-400",
        warning: "border-warning-300 focus-visible:ring-warning-400",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const selectTriggerVariants = cva(
  "flex h-full w-full items-center justify-between",
  {
    variants: {
      variant: {
        default: "text-neutral-900",
        error: "text-destructive",
        success: "text-success-700",
        warning: "text-warning-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const selectContentVariants = cva(
  "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-secondary-200 bg-white p-1 shadow-md",
  {
    variants: {
      position: {
        popper: "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        item: "",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      position: "popper",
      size: "md",
    },
  }
);

const selectOptionVariants = cva(
  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 outline-none",
  {
    variants: {
      variant: {
        default: "data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-900 data-[selected]:bg-primary-100 data-[selected]:text-primary-900",
        error: "data-[highlighted]:bg-destructive-50 data-[highlighted]:text-destructive-900 data-[selected]:bg-destructive-100 data-[selected]:text-destructive-900",
        success: "data-[highlighted]:bg-success-50 data-[highlighted]:text-success-900 data-[selected]:bg-success-100 data-[selected]:text-success-900",
        warning: "data-[highlighted]:bg-warning-50 data-[highlighted]:text-warning-900 data-[selected]:bg-warning-100 data-[selected]:text-warning-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size' | 'onChange'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  name?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    className,
    variant = "default",
    size,
    options,
    value,
    defaultValue,
    onChange,
    placeholder = "Select an option",
    label,
    error,
    helperText,
    disabled,
    required,
    containerClassName,
    labelClassName,
    name,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value || defaultValue);
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const optionsRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);
    
    const selectedOption = React.useMemo(() => {
      return options?.find(option => option.value === selectedValue);
    }, [options, selectedValue]);
    
    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      
      if (value === undefined) {
        setSelectedValue(option.value);
      }
      
      onChange?.(option.value);
      setIsOpen(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              handleSelect(option);
            }
          } else {
            setIsOpen(prev => !prev);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev => {
              let nextIndex = prev + 1;
              while (nextIndex < options.length && options[nextIndex].disabled) {
                nextIndex++;
              }
              return nextIndex >= options.length ? prev : nextIndex;
            });
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev => {
              let nextIndex = prev - 1;
              while (nextIndex >= 0 && options[nextIndex].disabled) {
                nextIndex--;
              }
              return nextIndex < 0 ? prev : nextIndex;
            });
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "Tab":
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
          break;
      }
    };
    
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current && 
          !containerRef.current.contains(event.target as Node) &&
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    
    React.useEffect(() => {
      if (isOpen) {
        const selectedIndex = options.findIndex(option => option.value === selectedValue);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }, [isOpen, options, selectedValue]);
    
    const containerStyle: React.CSSProperties = {
      width: '100%',
      marginBottom: '8px',
    };
    
    const labelStyle: React.CSSProperties = {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.375rem',
      color: '#1E293B',
    };
    
    const selectStyle: React.CSSProperties = {
      display: 'flex',
      width: '100%',
      borderRadius: '0.375rem',
      border: '1px solid',
      borderColor: error ? '#EF4444' : 
                  variant === 'success' ? '#10B981' : 
                  variant === 'warning' ? '#F59E0B' : '#E2E8F0',
      backgroundColor: 'white',
      padding: size === 'sm' ? '0.25rem 0.5rem' : 
               size === 'lg' ? '0.75rem 1rem' : '0.5rem 0.75rem',
      fontSize: size === 'sm' ? '0.75rem' : 
                size === 'lg' ? '1rem' : '0.875rem',
      height: size === 'sm' ? '2rem' : 
              size === 'lg' ? '3rem' : '2.5rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      outline: 'none',
    };
    
    const triggerStyle: React.CSSProperties = {
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: error ? '#EF4444' : 
             variant === 'success' ? '#047857' : 
             variant === 'warning' ? '#B45309' : '#0F172A',
    };
    
    const placeholderStyle: React.CSSProperties = {
      color: '#94A3B8',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 1,
      textAlign: 'left',
    };
    
    const selectedTextStyle: React.CSSProperties = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      flex: 1,
      textAlign: 'left',
    };
    
    const iconStyle: React.CSSProperties = {
      marginLeft: '0.5rem',
      height: '1rem',
      width: '1rem',
      flexShrink: 0,
      transition: 'transform 0.2s',
      transform: isOpen ? 'rotate(180deg)' : 'none',
    };
    
    const errorTextStyle: React.CSSProperties = {
      marginTop: '0.375rem',
      fontSize: '0.875rem',
      color: '#EF4444',
    };
    
    const helperTextStyle: React.CSSProperties = {
      marginTop: '0.375rem',
      fontSize: '0.875rem',
      color: '#64748B',
    };
    
    return (
      <div className={cn("w-full", containerClassName)} style={containerStyle}>
        {label && (
          <label 
            className={cn(
              "block text-sm font-medium text-neutral-800 mb-1.5", 
              required && "after:content-['*'] after:ml-0.5 after:text-destructive",
              labelClassName
            )}
            style={{
              ...labelStyle,
              ...(required ? { position: 'relative' } : {})
            }}
          >
            {label}
            {required && <span style={{ marginLeft: '0.125rem', color: '#EF4444' }}>*</span>}
          </label>
        )}
        
        <div 
          ref={containerRef}
          className={cn(
            selectVariants({ 
              variant: error ? "error" : variant, 
              size 
            }),
            className
          )}
          style={selectStyle}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          role="combobox"
          {...props}
        >
          <div 
            className={cn(selectTriggerVariants({ variant: error ? "error" : variant }))}
            style={triggerStyle}
          >
            <span 
              className={cn(
                "truncate flex-1 text-left",
                !selectedOption && "text-neutral-500"
              )}
              style={selectedOption ? selectedTextStyle : placeholderStyle}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={cn(
                "ml-2 h-4 w-4 shrink-0 transition-transform",
                isOpen && "rotate-180"
              )}
              style={iconStyle}
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
          
          {/* Hidden input for form submission */}
          {name && (
            <input 
              type="hidden" 
              name={name} 
              value={selectedValue || ""} 
            />
          )}
        </div>
        
        {isOpen && (
          <div 
            ref={optionsRef}
            className={cn(
              selectContentVariants({ size }),
              "mt-1 max-h-60 overflow-y-auto"
            )}
            style={{
              position: 'absolute',
              zIndex: 50,
              minWidth: '8rem',
              overflowY: 'auto',
              maxHeight: '15rem',
              marginTop: '0.25rem',
              borderRadius: '0.375rem',
              border: '1px solid #E2E8F0',
              backgroundColor: 'white',
              padding: '0.25rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              fontSize: size === 'sm' ? '0.75rem' : 
                       size === 'lg' ? '1rem' : '0.875rem',
            }}
            role="listbox"
            aria-orientation="vertical"
          >
            {options?.map((option, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = option.value === selectedValue;
              const isDisabled = option.disabled;
              
              const optionStyle: React.CSSProperties = {
                position: 'relative',
                display: 'flex',
                width: '100%',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                alignItems: 'center',
                borderRadius: '0.25rem',
                padding: '0.375rem 0.5rem',
                outline: 'none',
                opacity: isDisabled ? 0.5 : 1,
                backgroundColor: isSelected ? '#EFF6FF' : 
                                isHighlighted ? '#F8FAFC' : 'transparent',
                color: isSelected ? '#1E40AF' : 
                       isHighlighted ? '#1E293B' : '#0F172A',
              };
              
              return (
                <div
                  key={option.value}
                  className={cn(
                    selectOptionVariants({ variant: error ? "error" : variant }),
                    option.disabled && "opacity-50 cursor-not-allowed",
                    index === highlightedIndex && "data-[highlighted]",
                    option.value === selectedValue && "data-[selected]"
                  )}
                  style={optionStyle}
                  role="option"
                  aria-selected={option.value === selectedValue}
                  aria-disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
        
        {error && <p className="mt-1.5 text-sm text-destructive" style={errorTextStyle}>{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500" style={helperTextStyle}>{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants, selectTriggerVariants, selectContentVariants, selectOptionVariants };
