import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const dropdownMenuVariants = cva(
  "absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
  {
    variants: {
      position: {
        bottomLeft: "bottom-0 left-0 mb-2 origin-bottom-left",
        bottomRight: "bottom-0 right-0 mb-2 origin-bottom-right",
        topLeft: "top-0 left-0 mt-2 origin-top-left",
        topRight: "top-0 right-0 mt-2 origin-top-right",
      },
    },
    defaultVariants: {
      position: "bottomLeft",
    },
  }
);

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropdownMenuVariants> {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      className,
      trigger,
      items,
      position,
      isOpen: controlledIsOpen,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
    const setIsOpen = React.useCallback(
      (open: boolean) => {
        if (controlledIsOpen === undefined) {
          setUncontrolledIsOpen(open);
        } else {
          onOpenChange?.(open);
        }
      },
      [controlledIsOpen, onOpenChange]
    );

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, setIsOpen]);

    return (
      <div ref={containerRef} className="relative inline-block text-left">
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

        {isOpen && (
          <div
            ref={ref}
            className={cn(
              dropdownMenuVariants({
                position,
              }),
              className
            )}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
            {...props}
          >
            <div className="py-1" role="none">
              {items.map((item, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

export { DropdownMenu, dropdownMenuVariants };
