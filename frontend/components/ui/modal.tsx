import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const modalOverlayVariants = cva(
  "fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm",
  {
    variants: {
      position: {
        center: "items-center justify-center",
        top: "items-start justify-center pt-16",
        bottom: "items-end justify-center pb-16",
      },
    },
    defaultVariants: {
      position: "center",
    },
  }
);

const modalContentVariants = cva(
  "relative bg-white rounded-lg shadow-lg max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
        xl: "w-full max-w-xl",
        "2xl": "w-full max-w-2xl",
        "3xl": "w-full max-w-3xl",
        "4xl": "w-full max-w-4xl",
        "5xl": "w-full max-w-5xl",
        full: "w-full h-full max-w-full max-h-full rounded-none",
      },
      variant: {
        default: "border border-secondary-200",
        destructive: "border-destructive-100",
        success: "border-success-100",
        warning: "border-warning-100",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const modalHeaderVariants = cva(
  "flex items-center justify-between px-6 py-4 border-b",
  {
    variants: {
      variant: {
        default: "border-secondary-200",
        destructive: "border-destructive-100 bg-destructive-50 text-destructive-900",
        success: "border-success-100 bg-success-50 text-success-900",
        warning: "border-warning-100 bg-warning-50 text-warning-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const modalBodyVariants = cva(
  "p-6 overflow-auto",
  {
    variants: {
      spacing: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      spacing: "md",
    },
  }
);

const modalFooterVariants = cva(
  "flex items-center justify-end gap-3 px-6 py-4 border-t",
  {
    variants: {
      variant: {
        default: "border-secondary-200",
        destructive: "border-destructive-100",
        success: "border-success-100",
        warning: "border-warning-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size' | 'title'>,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  position?: VariantProps<typeof modalOverlayVariants>["position"];
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  bodySpacing?: VariantProps<typeof modalBodyVariants>["spacing"];
  showCloseButton?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    children,
    isOpen,
    onClose,
    title,
    description,
    footer,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    position,
    size,
    variant,
    bodyClassName,
    headerClassName,
    footerClassName,
    bodySpacing,
    showCloseButton = true,
    ...props
  }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = React.useState(false);
    
    React.useEffect(() => {
      if (isOpen) {
        setIsMounted(true);
      } else {
        const timer = setTimeout(() => {
          setIsMounted(false);
        }, 300); // Match this with your CSS transition duration
        return () => clearTimeout(timer);
      }
    }, [isOpen]);
    
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEsc && isOpen) {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeOnEsc, isOpen, onClose]);
    
    React.useEffect(() => {
      if (!isOpen || !contentRef.current) return;
      
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener("keydown", handleTabKey);
      firstElement.focus();
      
      return () => document.removeEventListener("keydown", handleTabKey);
    }, [isOpen]);
    
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);
    
    if (!isMounted) return null;
    
    return (
      <div
        className={cn(
          "fixed inset-0 z-50",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          "transition-opacity duration-300 ease-in-out"
        )}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-in-out',
        }}
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        {...props}
      >
        <div
          className={cn(modalOverlayVariants({ position }))}
          onClick={closeOnOverlayClick ? onClose : undefined}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            ref={contentRef}
            className={cn(
              modalContentVariants({ size, variant }),
              isOpen ? "scale-100" : "scale-95",
              "transition-transform duration-300 ease-in-out",
              className
            )}
            style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: size === 'full' ? '0' : '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              maxHeight: size === 'full' ? '100%' : 'calc(100vh - 2rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              width: '100%',
              maxWidth: size === 'sm' ? '24rem' : 
                        size === 'md' ? '28rem' : 
                        size === 'lg' ? '32rem' : 
                        size === 'xl' ? '36rem' : 
                        size === '2xl' ? '42rem' : 
                        size === '3xl' ? '48rem' : 
                        size === '4xl' ? '56rem' : 
                        size === '5xl' ? '64rem' : 
                        size === 'full' ? '100%' : '28rem',
              height: size === 'full' ? '100%' : 'auto',
              border: '1px solid',
              borderColor: variant === 'destructive' ? '#FEE2E2' : 
                           variant === 'success' ? '#D1FAE5' : 
                           variant === 'warning' ? '#FEF3C7' : '#E2E8F0',
              transform: isOpen ? 'scale(1)' : 'scale(0.95)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <div className={cn(modalHeaderVariants({ variant }), headerClassName)} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid',
                borderColor: variant === 'destructive' ? '#FEE2E2' : 
                             variant === 'success' ? '#D1FAE5' : 
                             variant === 'warning' ? '#FEF3C7' : '#E2E8F0',
                backgroundColor: variant === 'destructive' ? '#FEF2F2' : 
                                 variant === 'success' ? '#F0FDF4' : 
                                 variant === 'warning' ? '#FFFBEB' : 'white',
                color: variant === 'destructive' ? '#991B1B' : 
                       variant === 'success' ? '#166534' : 
                       variant === 'warning' ? '#92400E' : 'inherit',
              }}>
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-lg font-semibold" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className="text-sm text-neutral-600 mt-1" style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.25rem' }}>
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    className="text-neutral-500 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full p-1"
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                      color: '#64748B',
                      borderRadius: '9999px',
                      padding: '0.25rem',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      style={{ height: '1.25rem', width: '1.25rem' }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            <div className={cn(modalBodyVariants({ spacing: bodySpacing }), bodyClassName)} style={{
              padding: bodySpacing === 'none' ? '0' : 
                       bodySpacing === 'sm' ? '1rem' : 
                       bodySpacing === 'lg' ? '2rem' : '1.5rem',
              overflow: 'auto',
            }}>
              {children}
            </div>
            {footer && (
              <div className={cn(modalFooterVariants({ variant }), footerClassName)} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                borderTop: '1px solid',
                borderColor: variant === 'destructive' ? '#FEE2E2' : 
                             variant === 'success' ? '#D1FAE5' : 
                             variant === 'warning' ? '#FEF3C7' : '#E2E8F0',
              }}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
Modal.displayName = "Modal";

export { Modal, modalOverlayVariants, modalContentVariants, modalHeaderVariants, modalBodyVariants, modalFooterVariants };
