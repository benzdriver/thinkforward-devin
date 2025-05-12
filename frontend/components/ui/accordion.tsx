import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "border border-secondary-200 rounded-lg divide-y divide-secondary-200",
      bordered: "border border-secondary-200 rounded-lg divide-y divide-secondary-200",
      minimal: "divide-y divide-secondary-200",
      shadow: "shadow-md rounded-lg divide-y divide-secondary-200",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      bordered: "",
      minimal: "",
      shadow: "",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between py-4 px-5 text-left font-medium transition-all hover:bg-secondary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        bordered: "",
        minimal: "",
        shadow: "",
        ghost: "hover:bg-transparent",
      },
      size: {
        sm: "text-sm py-2 px-3",
        md: "text-base py-4 px-5",
        lg: "text-lg py-5 px-6",
      },
      iconPosition: {
        left: "flex-row-reverse justify-end",
        right: "justify-between",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      iconPosition: "right",
    },
  }
);

const accordionContentVariants = cva(
  "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        default: "bg-white px-5 pb-4 pt-0",
        bordered: "bg-white px-5 pb-4 pt-0",
        minimal: "px-5 pb-4 pt-0",
        shadow: "bg-white px-5 pb-4 pt-0",
        ghost: "px-5 pb-4 pt-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const AccordionContext = React.createContext<{
  type: "single" | "multiple";
  collapsible: boolean;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  variant?: VariantProps<typeof accordionVariants>["variant"];
}>({
  type: "single",
  collapsible: false,
  value: "",
  onValueChange: () => {},
});

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      variant,
      type = "single",
      collapsible = false,
      defaultValue,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (type === "multiple" ? [] : "")
    );

    const handleValueChange = React.useCallback(
      (newValue: string | string[]) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [onValueChange, value]
    );

    const contextValue = React.useMemo(
      () => ({
        type,
        collapsible,
        value: value !== undefined ? value : internalValue,
        onValueChange: handleValueChange,
        variant,
      }),
      [type, collapsible, value, internalValue, handleValueChange, variant]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(accordionVariants({ variant }), className)}
          {...props}
        />
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, variant, value, disabled = false, ...props }, ref) => {
    const { variant: contextVariant } = React.useContext(AccordionContext);
    const finalVariant = variant || contextVariant;

    return (
      <div
        ref={ref}
        data-state={getItemState(value)}
        data-disabled={disabled ? "true" : undefined}
        className={cn(
          accordionItemVariants({ variant: finalVariant }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
  icon?: React.ReactNode;
  showIcon?: boolean;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      className,
      variant,
      size,
      iconPosition,
      children,
      icon,
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const { variant: contextVariant } = React.useContext(AccordionContext);
    const finalVariant = variant || contextVariant;

    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );

    const iconElement = icon || defaultIcon;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          accordionTriggerVariants({
            variant: finalVariant,
            size,
            iconPosition,
          }),
          className
        )}
        {...props}
      >
        {children}
        {showIcon && (
          <span
            className={cn(
              "flex-shrink-0 transition-transform duration-200",
              iconPosition === "left" ? "mr-4" : "ml-4"
            )}
          >
            {iconElement}
          </span>
        )}
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, variant, children, ...props }, ref) => {
    const { variant: contextVariant } = React.useContext(AccordionContext);
    const finalVariant = variant || contextVariant;

    return (
      <div
        ref={ref}
        className={cn(
          accordionContentVariants({ variant: finalVariant }),
          className
        )}
        {...props}
      >
        <div className="pb-1 pt-0">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

function getItemState(value: string): "open" | "closed" {
  const context = React.useContext(AccordionContext);
  
  if (context.type === "single") {
    return context.value === value ? "open" : "closed";
  }
  
  return (context.value as string[]).includes(value) ? "open" : "closed";
}

export function useAccordionTrigger(itemValue: string) {
  const context = React.useContext(AccordionContext);
  
  const toggleItem = React.useCallback(() => {
    if (context.type === "single") {
      if (context.value === itemValue) {
        if (context.collapsible) {
          context.onValueChange("");
        }
      } else {
        context.onValueChange(itemValue);
      }
    } else {
      const currentValues = context.value as string[];
      if (currentValues.includes(itemValue)) {
        context.onValueChange(
          currentValues.filter((value) => value !== itemValue)
        );
      } else {
        context.onValueChange([...currentValues, itemValue]);
      }
    }
  }, [context, itemValue]);

  return {
    isOpen: getItemState(itemValue) === "open",
    toggle: toggleItem,
  };
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
