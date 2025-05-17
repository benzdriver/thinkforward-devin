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
      size = "md",
      shape = "circle",
      border = "none",
      status = "none",
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
    
    const avatarStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      height: size === 'xs' ? '1.5rem' : 
              size === 'sm' ? '2rem' : 
              size === 'md' ? '2.5rem' : 
              size === 'lg' ? '3rem' : 
              size === 'xl' ? '4rem' : 
              size === '2xl' ? '5rem' : '2.5rem',
      width: size === 'xs' ? '1.5rem' : 
             size === 'sm' ? '2rem' : 
             size === 'md' ? '2.5rem' : 
             size === 'lg' ? '3rem' : 
             size === 'xl' ? '4rem' : 
             size === '2xl' ? '5rem' : '2.5rem',
      fontSize: size === 'xs' ? '0.75rem' : 
                size === 'sm' ? '0.875rem' : 
                size === 'md' ? '1rem' : 
                size === 'lg' ? '1.125rem' : 
                size === 'xl' ? '1.25rem' : 
                size === '2xl' ? '1.5rem' : '1rem',
      borderRadius: shape === 'circle' ? '9999px' : '0.375rem',
      ...(border === 'thin' ? { boxShadow: '0 0 0 1px #E2E8F0' } : {}),
      ...(border === 'thick' ? { boxShadow: '0 0 0 2px #E2E8F0' } : {}),
      ...(status !== 'none' ? {
        '::after': {
          content: '""',
          position: 'absolute',
          bottom: '0',
          right: '0',
          height: '0.625rem',
          width: '0.625rem',
          borderRadius: '9999px',
          backgroundColor: status === 'online' ? '#10B981' : 
                           status === 'offline' ? '#CBD5E1' : 
                           status === 'busy' ? '#EF4444' : 
                           status === 'away' ? '#F59E0B' : 'transparent',
          boxShadow: '0 0 0 2px white',
        }
      } : {})
    };
    
    const imageStyle: React.CSSProperties = {
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      borderRadius: shape === 'circle' ? '9999px' : '0.375rem',
    };
    
    const fallbackStyle: React.CSSProperties = {
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      textTransform: 'uppercase',
      borderRadius: shape === 'circle' ? '9999px' : '0.375rem',
      backgroundColor: fallbackVariant === 'primary' ? '#DBEAFE' : 
                       fallbackVariant === 'secondary' ? '#F1F5F9' : 
                       fallbackVariant === 'destructive' ? '#FEE2E2' : 
                       fallbackVariant === 'success' ? '#D1FAE5' : 
                       fallbackVariant === 'warning' ? '#FEF3C7' : 
                       fallbackVariant === 'info' ? '#E0F2FE' : '#F1F5F9',
      color: fallbackVariant === 'primary' ? '#1E40AF' : 
             fallbackVariant === 'secondary' ? '#1E293B' : 
             fallbackVariant === 'destructive' ? '#991B1B' : 
             fallbackVariant === 'success' ? '#166534' : 
             fallbackVariant === 'warning' ? '#92400E' : 
             fallbackVariant === 'info' ? '#0C4A6E' : '#1E293B',
    };
    
    const svgStyle: React.CSSProperties = {
      height: '50%',
      width: '50%',
      color: 'currentColor',
    };
    
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape, border, status }), className)}
        style={avatarStyle}
        {...props}
      >
        {src && !showFallback && (
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={cn(avatarImageVariants({ shape }))}
            style={imageStyle}
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
            style={fallbackStyle}
            aria-hidden="true"
          >
            {fallback || initials || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-1/2 w-1/2"
                style={svgStyle}
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
    
    const groupStyle: React.CSSProperties = {
      display: 'flex',
    };
    
    const getAvatarItemStyle = (index: number): React.CSSProperties => ({
      position: 'relative',
      marginRight: spacing === 'tight' ? '-0.75rem' : 
                   spacing === 'normal' ? '-0.5rem' : 
                   spacing === 'loose' ? '-0.25rem' : '-0.5rem',
      zIndex: visibleAvatars.length - index,
    });
    
    const remainingStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing === 'tight' ? '-0.75rem' : 
                   spacing === 'normal' ? '-0.5rem' : 
                   spacing === 'loose' ? '-0.25rem' : '-0.5rem',
      zIndex: 0,
    };
    
    return (
      <div
        ref={ref}
        className={cn("flex", className)}
        style={groupStyle}
        {...props}
      >
        {visibleAvatars.map((child, index) => {
          if (!React.isValidElement(child)) return null;
          
          return (
            <div
              key={index}
              className={cn(spacingClasses[spacing], "relative")}
              style={getAvatarItemStyle(index)}
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
            style={remainingStyle}
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
