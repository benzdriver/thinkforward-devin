import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-neutral-50",
        light: "bg-white text-neutral-900 border border-neutral-200",
        primary: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
      position: {
        top: "data-[side=top]:slide-in-from-bottom-2",
        right: "data-[side=right]:slide-in-from-left-2",
        bottom: "data-[side=bottom]:slide-in-from-top-2",
        left: "data-[side=left]:slide-in-from-right-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "top",
    },
  }
);

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content' | 'size'>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  children: React.ReactElement;
  delayShow?: number;
  delayHide?: number;
  maxWidth?: number | string;
  disabled?: boolean;
  interactive?: boolean;
  offset?: number;
  asChild?: boolean;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({
    className,
    children,
    content,
    variant,
    size,
    position,
    delayShow = 300,
    delayHide = 100,
    maxWidth = 250,
    disabled = false,
    interactive = false,
    offset = 5,
    asChild = false,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });
    const [side, setSide] = React.useState<'top' | 'right' | 'bottom' | 'left'>('top');
    const triggerRef = React.useRef<HTMLElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const showTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    
    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      
      let top = triggerRect.top + scrollY - tooltipRect.height - offset;
      let left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2);
      let currentSide: 'top' | 'right' | 'bottom' | 'left' = 'top';
      
      if (top < scrollY) {
        top = triggerRect.bottom + scrollY + offset;
        currentSide = 'bottom';
      }
      
      if (left < scrollX) {
        left = scrollX;
      }
      
      if (left + tooltipRect.width > window.innerWidth + scrollX) {
        left = window.innerWidth + scrollX - tooltipRect.width;
      }
      
      if (position === 'left' || position === 'right') {
        if (position === 'left') {
          left = triggerRect.left + scrollX - tooltipRect.width - offset;
          top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
          currentSide = 'left';
          
          if (left < scrollX) {
            left = triggerRect.right + scrollX + offset;
            currentSide = 'right';
          }
        } else {
          left = triggerRect.right + scrollX + offset;
          top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2);
          currentSide = 'right';
          
          if (left + tooltipRect.width > window.innerWidth + scrollX) {
            left = triggerRect.left + scrollX - tooltipRect.width - offset;
            currentSide = 'left';
          }
        }
      }
      
      setTooltipPosition({ top, left });
      setSide(currentSide);
    }, [offset, position]);
    
    const showTooltip = React.useCallback(() => {
      if (disabled) return;
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      
      showTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        requestAnimationFrame(() => {
          updatePosition();
        });
      }, delayShow);
    }, [disabled, delayShow, updatePosition]);
    
    const hideTooltip = React.useCallback(() => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, delayHide);
    }, [delayHide]);
    
    React.useEffect(() => {
      const handleResize = () => {
        if (isVisible) {
          updatePosition();
        }
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }, [isVisible, updatePosition]);
    
    React.useEffect(() => {
      return () => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);
    
    const childElement = React.isValidElement(children) ? children : <span>{children}</span>;
    
    const childProps = childElement.props as Record<string, any>;
    
    const child = React.cloneElement(
      childElement,
      {
        ref: (node: HTMLElement | null) => {
          if (node) {
            triggerRef.current = node;
            
            const childRef = (childElement as any).ref;
            if (childRef) {
              if (typeof childRef === 'function') {
                childRef(node);
              } else if (childRef.current !== undefined) {
                childRef.current = node;
              }
            }
          }
        },
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          showTooltip();
          if (typeof childProps.onMouseEnter === 'function') {
            childProps.onMouseEnter(e);
          }
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
          if (!interactive) hideTooltip();
          if (typeof childProps.onMouseLeave === 'function') {
            childProps.onMouseLeave(e);
          }
        },
        onFocus: (e: React.FocusEvent<HTMLElement>) => {
          showTooltip();
          if (typeof childProps.onFocus === 'function') {
            childProps.onFocus(e);
          }
        },
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
          hideTooltip();
          if (typeof childProps.onBlur === 'function') {
            childProps.onBlur(e);
          }
        },
      }
    );
    
    return (
      <>
        {child}
        {isVisible && (
          <div
            ref={tooltipRef}
            role="tooltip"
            className={cn(
              tooltipVariants({ variant, size, position }),
              className
            )}
            style={{
              position: 'absolute',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
              zIndex: 9999,
            }}
            data-state={isVisible ? 'open' : 'closed'}
            data-side={side}
            onMouseEnter={interactive ? showTooltip : undefined}
            onMouseLeave={interactive ? hideTooltip : undefined}
            {...props}
          >
            {content}
          </div>
        )}
      </>
    );
  }
);
Tooltip.displayName = "Tooltip";

export { Tooltip, tooltipVariants };
