import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const tabsRootVariants = cva("w-full", {
  variants: {
    orientation: {
      horizontal: "space-y-2",
      vertical: "flex space-x-2",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const tabsListVariants = cva(
  "flex relative",
  {
    variants: {
      variant: {
        default: "border-b border-secondary-200",
        pills: "p-1 bg-secondary-50 rounded-lg",
        underline: "border-b border-secondary-200",
        bordered: "border border-secondary-200 rounded-lg p-1",
        minimal: "",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
      orientation: "horizontal",
    },
  }
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-b-2 border-transparent hover:text-primary-600 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600",
        pills: "rounded-md hover:bg-secondary-100 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm",
        underline: "border-b-2 border-transparent hover:text-primary-600 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600",
        bordered: "rounded-md hover:bg-secondary-100 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-sm",
        minimal: "hover:text-primary-600 data-[state=active]:text-primary-600 data-[state=active]:font-semibold",
      },
      size: {
        sm: "text-sm px-2 py-1",
        md: "text-base px-3 py-2",
        lg: "text-lg px-4 py-3",
      },
      fullWidth: {
        true: "flex-1",
        false: "",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
      orientation: "horizontal",
    },
  }
);

const tabsContentVariants = cva(
  "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        pills: "",
        underline: "",
        bordered: "p-4 border border-secondary-200 rounded-lg",
        minimal: "",
      },
      animation: {
        none: "",
        fade: "data-[state=inactive]:animate-fadeOut data-[state=active]:animate-fadeIn",
        slide: "data-[state=inactive]:animate-slideOut data-[state=active]:animate-slideIn",
        zoom: "data-[state=inactive]:animate-zoomOut data-[state=active]:animate-zoomIn",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "fade",
    },
  }
);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsRootVariants> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  variant?: VariantProps<typeof tabsListVariants>["variant"];
  size?: VariantProps<typeof tabsListVariants>["size"];
  orientation?: VariantProps<typeof tabsRootVariants>["orientation"];
}>({
  value: "",
  onValueChange: () => {},
});

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, orientation = "horizontal", children, ...props }, ref) => {
    const [tabValue, setTabValue] = React.useState<string>(defaultValue || "");
    
    const handleValueChange = React.useCallback((newValue: string) => {
      if (value === undefined) {
        setTabValue(newValue);
      }
      onValueChange?.(newValue);
    }, [onValueChange, value]);
    
    const contextValue = React.useMemo(() => ({
      value: value !== undefined ? value : tabValue,
      onValueChange: handleValueChange,
      orientation,
    }), [value, tabValue, handleValueChange, orientation]);
    
    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(tabsRootVariants({ orientation }), className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "default", size = "md", fullWidth, orientation, ...props }, ref) => {
    const { orientation: contextOrientation } = React.useContext(TabsContext);
    const finalOrientation = orientation || contextOrientation;
    
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          tabsListVariants({
            variant,
            size,
            fullWidth,
            orientation: finalOrientation,
          }),
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof tabsTriggerVariants> {
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, variant, size, fullWidth, orientation, disabled, icon, badge, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant: contextVariant, size: contextSize, orientation: contextOrientation } = React.useContext(TabsContext);
    const isActive = selectedValue === value;
    const finalVariant = variant || contextVariant;
    const finalSize = size || contextSize;
    const finalOrientation = orientation || contextOrientation;
    
    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={`panel-${value}`}
        id={`tab-${value}`}
        disabled={disabled}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => onValueChange(value)}
        className={cn(
          tabsTriggerVariants({
            variant: finalVariant,
            size: finalSize,
            fullWidth,
            orientation: finalOrientation,
          }),
          className
        )}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        {badge && <span className="ml-2">{badge}</span>}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsContentVariants> {
  value: string;
  forceMount?: boolean;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, variant, animation, forceMount, children, ...props }, ref) => {
    const { value: selectedValue, variant: contextVariant } = React.useContext(TabsContext);
    const isActive = selectedValue === value;
    const finalVariant = variant || contextVariant;
    
    if (!isActive && !forceMount) {
      return null;
    }
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={`tab-${value}`}
        id={`panel-${value}`}
        hidden={!isActive && !forceMount}
        data-state={isActive ? "active" : "inactive"}
        tabIndex={isActive ? 0 : -1}
        className={cn(
          tabsContentVariants({
            variant: finalVariant,
            animation,
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
