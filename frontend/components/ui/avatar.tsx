import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
      border: {
        none: "",
        thin: "ring-1 ring-secondary-200",
        thick: "ring-2 ring-secondary-200",
      },
      status: {
        none: "",
        online: "after:absolute after:bottom-0 after:right-0 after:h-2.5 after:w-2.5 after:rounded-full after:bg-success after:ring-2 after:ring-white",
        offline: "after:absolute after:bottom-0 after:right-0 after:h-2.5 after:w-2.5 after:rounded-full after:bg-neutral-300 after:ring-2 after:ring-white",
        busy: "after:absolute after:bottom-0 after:right-0 after:h-2.5 after:w-2.5 after:rounded-full after:bg-destructive after:ring-2 after:ring-white",
        away: "after:absolute after:bottom-0 after:right-0 after:h-2.5 after:w-2.5 after:rounded-full after:bg-warning after:ring-2 after:ring-white",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      border: "none",
      status: "none",
    },
  }
);

const avatarImageVariants = cva("h-full w-full object-cover", {
  variants: {
    shape: {
      circle: "rounded-full",
      square: "rounded-md",
    },
  },
  defaultVariants: {
    shape: "circle",
  },
});

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center font-medium uppercase",
  {
    variants: {
      variant: {
        default: "bg-secondary-100 text-secondary-800",
        primary: "bg-primary-100 text-primary-800",
        secondary: "bg-secondary-100 text-secondary-800",
        destructive: "bg-destructive-100 text-destructive-800",
        success: "bg-success-100 text-success-800",
        warning: "bg-warning-100 text-warning-800",
        info: "bg-info-100 text-info-800",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "circle",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  fallbackVariant?: VariantProps<typeof avatarFallbackVariants>["variant"];
  delayMs?: number;
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = "",
      fallback,
      fallbackVariant = "default",
      size,
      shape,
      border,
      status,
      delayMs = 600,
      onLoadingStatusChange,
      ...props
    },
    ref
  ) => {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const [showFallback, setShowFallback] = React.useState(!src);
    const imageRef = React.useRef<HTMLImageElement>(null);
    
    React.useEffect(() => {
      if (!src) {
        setShowFallback(true);
        onLoadingStatusChange?.("error");
        return;
      }
      
      setShowFallback(false);
      
      if (imageRef.current?.complete) {
        setIsImageLoaded(true);
        onLoadingStatusChange?.("loaded");
        return;
      }
      
      let timeoutId: NodeJS.Timeout;
      
      if (delayMs > 0) {
        timeoutId = setTimeout(() => {
          if (!isImageLoaded) {
            setShowFallback(true);
          }
        }, delayMs);
      }
      
      onLoadingStatusChange?.("loading");
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [src, delayMs, isImageLoaded, onLoadingStatusChange]);
    
    const initials = React.useMemo(() => {
      if (fallback) return null;
      
      if (!alt) return null;
      
      return alt
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }, [alt, fallback]);
    
    const handleImageLoad = () => {
      setIsImageLoaded(true);
      setShowFallback(false);
      onLoadingStatusChange?.("loaded");
    };
    
    const handleImageError = () => {
      setIsImageLoaded(false);
      setShowFallback(true);
      onLoadingStatusChange?.("error");
    };
    
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape, border, status }), className)}
        {...props}
      >
        {src && !showFallback && (
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={cn(avatarImageVariants({ shape }))}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {showFallback && (
          <div
            className={cn(
              avatarFallbackVariants({
                variant: fallbackVariant,
                shape,
              })
            )}
            aria-hidden="true"
          >
            {fallback || initials || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-1/2 w-1/2"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  spacing?: "tight" | "normal" | "loose";
  size?: VariantProps<typeof avatarVariants>["size"];
  shape?: VariantProps<typeof avatarVariants>["shape"];
  border?: VariantProps<typeof avatarVariants>["border"];
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      children,
      max,
      spacing = "normal",
      size,
      shape,
      border = "thin",
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);
    const totalAvatars = childrenArray.length;
    const visibleAvatars = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingAvatars = max ? totalAvatars - max : 0;
    
    const spacingClasses = {
      tight: "-mr-3",
      normal: "-mr-2",
      loose: "-mr-1",
    };
    
    return (
      <div
        ref={ref}
        className={cn("flex", className)}
        {...props}
      >
        {visibleAvatars.map((child, index) => {
          if (!React.isValidElement(child)) return null;
          
          return (
            <div
              key={index}
              className={cn(spacingClasses[spacing], "relative")}
              style={{ zIndex: visibleAvatars.length - index }}
            >
              {React.cloneElement(child as React.ReactElement<AvatarProps>, {
                size: size || (child as React.ReactElement<AvatarProps>).props.size,
                shape: shape || (child as React.ReactElement<AvatarProps>).props.shape,
                border: border || (child as React.ReactElement<AvatarProps>).props.border,
              })}
            </div>
          );
        })}
        
        {remainingAvatars > 0 && (
          <div
            className={cn(
              "relative flex items-center justify-center",
              spacingClasses[spacing]
            )}
            style={{ zIndex: 0 }}
          >
            <Avatar
              size={size}
              shape={shape}
              border={border}
              fallbackVariant="secondary"
              fallback={`+${remainingAvatars}`}
            />
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup, avatarVariants, avatarImageVariants, avatarFallbackVariants };
