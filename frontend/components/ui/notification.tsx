import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const notificationVariants = cva(
  "relative flex w-full items-center gap-3 rounded-lg p-4 shadow-md",
  {
    variants: {
      variant: {
        info: "bg-info-50 text-info-800 border border-info-200",
        success: "bg-success-50 text-success-800 border border-success-200",
        warning: "bg-warning-50 text-warning-800 border border-warning-200",
        error: "bg-destructive-50 text-destructive-800 border border-destructive-200",
        neutral: "bg-neutral-50 text-neutral-800 border border-neutral-200",
      },
      size: {
        sm: "p-2 text-sm",
        md: "p-4 text-base",
        lg: "p-6 text-lg",
      },
      position: {
        topLeft: "fixed top-4 left-4",
        topCenter: "fixed top-4 left-1/2 -translate-x-1/2",
        topRight: "fixed top-4 right-4",
        bottomLeft: "fixed bottom-4 left-4",
        bottomCenter: "fixed bottom-4 left-1/2 -translate-x-1/2",
        bottomRight: "fixed bottom-4 right-4",
        inline: "relative",
      },
      hasIcon: {
        true: "",
        false: "",
      },
      hasAction: {
        true: "",
        false: "",
      },
      hasClose: {
        true: "pr-10",
        false: "",
      },
      isAnimated: {
        true: "animate-in fade-in slide-in-from-top-5 duration-300",
        false: "",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
      position: "inline",
      hasIcon: true,
      hasAction: false,
      hasClose: true,
      isAnimated: false,
    },
  }
);

export interface NotificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof notificationVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      className,
      variant,
      size,
      position,
      hasIcon,
      hasAction,
      hasClose,
      isAnimated,
      title,
      description,
      icon,
      action,
      onClose,
      autoClose = false,
      autoCloseDelay = 5000,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (autoClose && isVisible) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }, [autoClose, autoCloseDelay, isVisible]);

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) {
      return null;
    }

    const getDefaultIcon = () => {
      switch (variant) {
        case "info":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-info-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          );
        case "success":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          );
        case "warning":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-warning-500"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          );
        case "error":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-destructive-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          );
        case "neutral":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-500"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({
            variant,
            size,
            position,
            hasIcon: hasIcon || !!icon,
            hasAction: hasAction || !!action,
            hasClose,
            isAnimated,
          }),
          className
        )}
        role="alert"
        {...props}
      >
        {(hasIcon || icon) && (
          <div className="shrink-0">{icon || getDefaultIcon()}</div>
        )}

        <div className="flex-1 space-y-1">
          {title && (
            <div className="font-medium">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
        </div>

        {(hasAction || action) && (
          <div className="shrink-0">
            {action}
          </div>
        )}

        {hasClose && (
          <button
            type="button"
            className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={handleClose}
            aria-label="关闭通知"
          >
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
              className="opacity-70"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Notification.displayName = "Notification";

export interface ToastContainerProps {
  position?: VariantProps<typeof notificationVariants>["position"];
  children?: React.ReactNode;
  className?: string;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "topRight",
  children,
  className,
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case "topLeft":
        return "fixed top-4 left-4 z-50 flex flex-col gap-2 w-80";
      case "topCenter":
        return "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-80";
      case "topRight":
        return "fixed top-4 right-4 z-50 flex flex-col gap-2 w-80";
      case "bottomLeft":
        return "fixed bottom-4 left-4 z-50 flex flex-col gap-2 w-80";
      case "bottomCenter":
        return "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-80";
      case "bottomRight":
        return "fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80";
      default:
        return "fixed top-4 right-4 z-50 flex flex-col gap-2 w-80";
    }
  };

  return (
    <div className={cn(getPositionClasses(), className)}>
      {children}
    </div>
  );
};

type Toast = {
  id: string;
  variant?: VariantProps<typeof notificationVariants>["variant"];
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  autoClose?: boolean;
  autoCloseDelay?: number;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: VariantProps<typeof notificationVariants>["position"];
}> = ({ children, position = "topRight" }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer position={position}>
        {toasts.map((toast) => (
          <Notification
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            icon={toast.icon}
            action={toast.action}
            autoClose={toast.autoClose}
            autoCloseDelay={toast.autoCloseDelay}
            isAnimated
            position="inline"
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export { Notification, ToastContainer };
