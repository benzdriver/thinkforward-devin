import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const sectionContainerVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-white",
        filled: "bg-neutral-50",
        bordered: "border border-neutral-200 rounded-lg",
        card: "bg-white border border-neutral-200 rounded-lg shadow-sm",
        highlight: "bg-primary-50 border border-primary-100 rounded-lg",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
      margin: {
        none: "",
        sm: "my-4",
        md: "my-6",
        lg: "my-8",
        xl: "my-12",
      },
      width: {
        full: "w-full",
        container: "max-w-7xl mx-auto",
        narrow: "max-w-3xl mx-auto",
        wide: "max-w-screen-2xl mx-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      margin: "md",
      width: "full",
    },
  }
);

export interface SectionContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof sectionContainerVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  footerClassName?: string;
  divider?: boolean;
  headerDivider?: boolean;
  footerDivider?: boolean;
}

export function SectionContainer({
  className,
  variant,
  padding,
  margin,
  width,
  title,
  description,
  titleClassName,
  descriptionClassName,
  headerClassName,
  contentClassName,
  headerActions,
  footer,
  footerClassName,
  divider = false,
  headerDivider = false,
  footerDivider = false,
  children,
  id,
  ...props
}: SectionContainerProps) {
  const hasHeader = !!(title || description || headerActions);
  const hasFooter = !!footer;
  
  return (
    <section
      id={id}
      className={cn(
        sectionContainerVariants({
          variant,
          padding: hasHeader || hasFooter ? "none" : padding,
          margin,
          width,
        }),
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
            padding && `pt-${padding?.toString().replace('p-', '') || '4'} px-${padding?.toString().replace('p-', '') || '4'}`,
            headerDivider && "border-b border-neutral-200 pb-4",
            headerClassName
          )}
        >
          <div>
            {title && (
              <h2 className={cn(
                "text-xl font-semibold text-foreground",
                titleClassName
              )}>
                {title}
              </h2>
            )}
            
            {description && (
              <p className={cn(
                "mt-1 text-sm text-neutral-600",
                descriptionClassName
              )}>
                {description}
              </p>
            )}
          </div>
          
          {headerActions && (
            <div className="flex items-center space-x-2 shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className={cn(
        "w-full",
        padding && !hasHeader && !hasFooter ? "" : `p-${padding?.toString().replace('p-', '') || '4'}`,
        hasHeader && !headerDivider && "pt-4",
        divider && "divide-y divide-neutral-200",
        contentClassName
      )}>
        {children}
      </div>
      
      {hasFooter && (
        <div className={cn(
          padding && `pb-${padding?.toString().replace('p-', '') || '4'} px-${padding?.toString().replace('p-', '') || '4'}`,
          footerDivider && "border-t border-neutral-200 pt-4",
          footerClassName
        )}>
          {footer}
        </div>
      )}
    </section>
  );
}
