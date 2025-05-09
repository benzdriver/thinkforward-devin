import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const pageHeaderVariants = cva(
  "mb-6",
  {
    variants: {
      variant: {
        default: "",
        bordered: "pb-4 border-b border-neutral-200",
        filled: "p-6 bg-neutral-50 rounded-lg",
        gradient: "p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg",
      },
      size: {
        sm: "space-y-1",
        md: "space-y-2",
        lg: "space-y-3",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      align: "left",
    },
  }
);

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof pageHeaderVariants> {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  backLink?: {
    href: string;
    label?: string;
  };
  badge?: React.ReactNode;
  icon?: React.ReactNode;
}

export function PageHeader({
  className,
  variant,
  size,
  align,
  title,
  description,
  breadcrumbs,
  actions,
  backLink,
  badge,
  icon,
  ...props
}: PageHeaderProps) {
  const { t } = useTranslation("common");
  
  return (
    <div
      className={cn(
        pageHeaderVariants({
          variant,
          size,
          align,
        }),
        className
      )}
      {...props}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-2" aria-label={t("common.breadcrumb") as string}>
          <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-neutral-400">/</span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-neutral-500 hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-neutral-700">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      {backLink && (
        <div className="mb-2">
          <Link
            href={backLink.href}
            className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-600 transition-colors"
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
              className="mr-1"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {backLink.label || t("common.back")}
          </Link>
        </div>
      )}
      
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        align === "center" && "items-center",
        align === "right" && "items-end"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center",
          align === "right" && "justify-end"
        )}>
          {icon && (
            <div className="shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className={cn(
              "font-bold text-foreground",
              {
                "text-xl": size === "sm",
                "text-2xl": size === "md",
                "text-3xl": size === "lg",
              }
            )}>
              {title}
              {badge && (
                <span className="ml-2 inline-flex align-middle">
                  {badge}
                </span>
              )}
            </h1>
            
            {description && (
              <p className={cn(
                "text-neutral-600 mt-1",
                {
                  "text-sm": size === "sm",
                  "text-base": size === "md",
                  "text-lg": size === "lg",
                }
              )}>
                {description}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className={cn(
            "flex items-center space-x-2 shrink-0",
            align === "center" && "justify-center",
            align === "right" && "justify-end"
          )}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
