import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const searchInputVariants = cva(
  "flex items-center w-full rounded-md border border-secondary-200 bg-white text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-secondary-200",
        filled: "border-transparent bg-secondary-50",
        outline: "border-secondary-300",
        ghost: "border-transparent bg-transparent hover:bg-secondary-50",
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-4 py-2 text-base",
      },
      iconPosition: {
        left: "pl-9",
        right: "pr-9",
        both: "pl-9 pr-9",
        none: "",
      },
      isRounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
      hasClearButton: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      iconPosition: "left",
      isRounded: false,
      hasClearButton: true,
    },
    compoundVariants: [
      {
        iconPosition: "left",
        hasClearButton: true,
        className: "pl-9 pr-9",
      },
      {
        iconPosition: "right",
        hasClearButton: true,
        className: "pr-16",
      },
    ],
  }
);

const searchIconContainerVariants = cva("absolute flex items-center justify-center", {
  variants: {
    position: {
      left: "left-0",
      right: "right-0",
    },
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    position: "left",
    size: "md",
  },
});

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchInputVariants> {
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  onClear?: () => void;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      variant,
      size,
      iconPosition,
      isRounded,
      hasClearButton,
      searchIcon,
      clearIcon,
      onClear,
      loading,
      loadingIcon,
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(value || "");
    
    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };
    
    const handleClear = () => {
      setInputValue("");
      onClear?.();
      
      const syntheticEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange?.(syntheticEvent);
    };
    
    const showLeftIcon = iconPosition === "left" || iconPosition === "both";
    const showRightIcon = iconPosition === "right" || iconPosition === "both";
    const showClearButton = hasClearButton && inputValue && !disabled;
    
    const defaultSearchIcon = (
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
        className="text-neutral-500"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
    
    const defaultClearIcon = (
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
        className="text-neutral-500"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    );
    
    const defaultLoadingIcon = (
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
        className="animate-spin text-neutral-500"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
    
    return (
      <div className="relative w-full">
        {showLeftIcon && (
          <div
            className={cn(
              searchIconContainerVariants({
                position: "left",
                size,
              })
            )}
          >
            {loading ? loadingIcon || defaultLoadingIcon : searchIcon || defaultSearchIcon}
          </div>
        )}
        
        <input
          type="text"
          className={cn(
            searchInputVariants({
              variant,
              size,
              iconPosition,
              isRounded,
              hasClearButton,
            }),
            className
          )}
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        
        {showRightIcon && !showClearButton && (
          <div
            className={cn(
              searchIconContainerVariants({
                position: "right",
                size,
              })
            )}
          >
            {loading ? loadingIcon || defaultLoadingIcon : searchIcon || defaultSearchIcon}
          </div>
        )}
        
        {showClearButton && (
          <button
            type="button"
            className={cn(
              searchIconContainerVariants({
                position: "right",
                size,
              }),
              "cursor-pointer hover:text-neutral-700 focus:outline-none"
            )}
            onClick={handleClear}
            aria-label="清除搜索"
          >
            {clearIcon || defaultClearIcon}
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput, searchInputVariants };
