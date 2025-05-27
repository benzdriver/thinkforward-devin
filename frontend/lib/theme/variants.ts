/**
 * 统一的组件变体系统
 * 提供所有组件共享的基础变体定义，确保UI一致性
 */

export const baseVariants = {
  size: {
    xs: "h-7 px-2.5 text-xs",
    sm: "h-9 px-3.5 text-xs", 
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-base",
    xl: "h-14 px-8 py-4 text-lg",
  },
  
  variant: {
    default: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700",
    primary: "bg-gradient-primary text-white hover:bg-primary-600 shadow-colored hover:shadow-colored-lg dark:shadow-none dark:bg-primary-700 dark:hover:bg-primary-600",
    secondary: "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700",
    outline: "border border-neutral-200 bg-transparent text-foreground hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
    ghost: "bg-transparent text-foreground hover:bg-neutral-50 dark:text-neutral-100 dark:hover:bg-neutral-800",
    link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
    destructive: "bg-gradient-destructive text-white hover:bg-destructive-600 shadow-sm dark:bg-destructive-700 dark:hover:bg-destructive-600",
    success: "bg-gradient-success text-white hover:bg-success-600 shadow-sm dark:bg-success-700 dark:hover:bg-success-600",
    warning: "bg-gradient-warning text-white hover:bg-warning-600 shadow-sm dark:bg-warning-700 dark:hover:bg-warning-600",
    neutral: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 shadow-sm dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600",
    accent: "bg-gradient-primary text-white hover:bg-primary-600 shadow-colored dark:bg-primary-700 dark:hover:bg-primary-600",
    glass: "bg-white bg-opacity-80 backdrop-blur-md border border-white/20 text-neutral-800 shadow-md dark:bg-neutral-900/80 dark:text-neutral-100 dark:border-neutral-700/30",
  },
  
  rounded: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },
  
  state: {
    default: "",
    hover: "hover:shadow-md hover:-translate-y-0.5",
    active: "active:shadow-inner active:translate-y-0",
    disabled: "opacity-50 cursor-not-allowed",
    loading: "opacity-80 cursor-wait",
  },
  
  width: {
    auto: "w-auto",
    full: "w-full",
  }
};

export const componentVariants = {
  button: {
    withIcon: {
      true: "inline-flex items-center gap-2",
    },
    iconOnly: {
      true: "p-0 flex items-center justify-center",
      xs: "w-7 h-7",
      sm: "w-9 h-9",
      md: "w-10 h-10",
      lg: "w-12 h-12",
      xl: "w-14 h-14",
    },
  },
  
  card: {
    hover: {
      true: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
    },
    bordered: {
      true: "border",
      false: "border-none",
    },
  },
  
  input: {
    withIcon: {
      start: "pl-9",
      end: "pr-9",
      both: "pl-9 pr-9",
    },
  },
  
  badge: {
    removable: {
      true: "pr-1",
    },
    interactive: {
      true: "cursor-pointer transition-colors",
    },
  },
};

export const componentSpecs = {
  button: {
    variants: ['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'success', 'warning', 'neutral', 'accent', 'glass'],
    sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
    states: ['default', 'hover', 'active', 'disabled', 'loading'],
    rounded: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
  },
  card: {
    variants: ['default', 'feature', 'destructive', 'success', 'warning', 'neutral', 'elevated', 'flat', 'gradient', 'accent', 'glass'],
    states: ['default', 'hover'],
    rounded: ['none', 'default', 'lg', 'full'],
  },
  input: {
    variants: ['default', 'error', 'success', 'warning'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'focus', 'disabled', 'error'],
  },
  badge: {
    variants: ['default', 'primary', 'secondary', 'destructive', 'success', 'warning', 'info', 'outline'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'hover', 'interactive', 'removable'],
  },
  dropdown: {
    variants: ['default', 'error', 'success', 'warning'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'focus', 'disabled'],
  },
};
