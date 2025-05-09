import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const dashboardLayoutVariants = cva(
  "flex min-h-screen bg-neutral-50",
  {
    variants: {
      variant: {
        default: "bg-neutral-50",
        white: "bg-white",
        gradient: "bg-gradient-to-br from-primary-50 to-secondary-50",
      },
      sidebarCollapsible: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      sidebarCollapsible: true,
    },
  }
);

const sidebarVariants = cva(
  "flex flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-900",
        dark: "bg-neutral-900 text-white border-neutral-800",
        primary: "bg-primary-900 text-white border-primary-800",
        brand: "bg-gradient-to-b from-primary-900 to-primary-800 text-white border-primary-800",
      },
      width: {
        sm: "w-16",
        md: "w-64",
        lg: "w-80",
      },
      collapsed: {
        true: "w-16",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      width: "md",
      collapsed: false,
    },
  }
);

const mainContentVariants = cva(
  "flex flex-col flex-1 overflow-x-hidden",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  }
);

export interface DashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardLayoutVariants> {
  logo?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  sidebarVariant?: VariantProps<typeof sidebarVariants>["variant"];
  sidebarWidth?: VariantProps<typeof sidebarVariants>["width"];
  defaultCollapsed?: boolean;
  header?: React.ReactNode;
  headerFixed?: boolean;
  footer?: React.ReactNode;
  footerFixed?: boolean;
  mainPadding?: VariantProps<typeof mainContentVariants>["padding"];
  navigationItems?: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    children?: {
      title: string;
      href: string;
      icon?: React.ReactNode;
      badge?: React.ReactNode;
    }[];
  }[];
}

export function DashboardLayout({
  className,
  children,
  variant,
  sidebarCollapsible,
  logo,
  sidebarContent,
  sidebarFooter,
  sidebarVariant = "default",
  sidebarWidth = "md",
  defaultCollapsed = false,
  header,
  headerFixed = true,
  footer,
  footerFixed = false,
  mainPadding = "md",
  navigationItems = [],
  ...props
}: DashboardLayoutProps) {
  const { t } = useTranslation("common");
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  
  const toggleSidebar = () => {
    if (sidebarCollapsible) {
      setCollapsed(!collapsed);
    }
  };
  
  const defaultLogo = (
    <div className="flex items-center space-x-2 px-4 py-4">
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
        <span className="text-white font-bold">TF</span>
      </div>
      {!collapsed && (
        <span className="text-xl font-bold">ThinkForward</span>
      )}
    </div>
  );
  
  const defaultHeader = (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 h-16 border-b border-neutral-200 bg-white",
      headerFixed && "sticky top-0 z-10"
    )}>
      <div className="flex items-center space-x-4">
        {sidebarCollapsible && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-neutral-100 focus:outline-none"
            aria-label={collapsed ? t("common.expandSidebar") as string : t("common.collapseSidebar") as string}
          >
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
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-medium">{t("dashboard.title")}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="p-2 rounded-md hover:bg-neutral-100 focus:outline-none"
          aria-label={t("common.notifications") as string}
        >
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
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        
        <div className="relative">
          <button
            type="button"
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-700 font-medium">U</span>
            </div>
            {!collapsed && (
              <span className="text-sm font-medium">{t("common.userProfile")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
  
  const defaultFooter = (
    <div className={cn(
      "px-4 py-3 border-t border-neutral-200 text-sm text-neutral-500",
      footerFixed && "sticky bottom-0 z-10 bg-white"
    )}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          © {new Date().getFullYear()} ThinkForward AI. {t("common.allRightsReserved")}
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/terms" className="hover:text-neutral-700 transition-colors">
            {t("common.terms")}
          </Link>
          <Link href="/privacy" className="hover:text-neutral-700 transition-colors">
            {t("common.privacy")}
          </Link>
          <Link href="/help" className="hover:text-neutral-700 transition-colors">
            {t("common.help")}
          </Link>
        </div>
      </div>
    </div>
  );
  
  const renderNavigationItems = () => {
    return (
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-primary-600 transition-colors",
                collapsed ? "justify-center" : "space-x-3"
              )}
            >
              {item.icon && (
                <span className="shrink-0">{item.icon}</span>
              )}
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span>{item.badge}</span>
                  )}
                </>
              )}
            </Link>
            
            {!collapsed && item.children && item.children.length > 0 && (
              <div className="pl-10 space-y-1">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href}
                    className="flex items-center px-2 py-1.5 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-primary-600 transition-colors space-x-3"
                  >
                    {child.icon && (
                      <span className="shrink-0">{child.icon}</span>
                    )}
                    <span className="flex-1">{child.title}</span>
                    {child.badge && (
                      <span>{child.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  };
  
  const defaultSidebarContent = (
    <>
      {logo || defaultLogo}
      {navigationItems.length > 0 ? renderNavigationItems() : (
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-primary-600 transition-colors",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
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
              className="shrink-0"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            {!collapsed && (
              <span>{t("dashboard.overview")}</span>
            )}
          </Link>
          
          <Link
            href="/dashboard/profile"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-primary-600 transition-colors",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
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
              className="shrink-0"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {!collapsed && (
              <span>{t("dashboard.profile")}</span>
            )}
          </Link>
          
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-neutral-100 hover:text-primary-600 transition-colors",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
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
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {!collapsed && (
              <span>{t("dashboard.settings")}</span>
            )}
          </Link>
        </nav>
      )}
    </>
  );
  
  const defaultSidebarFooter = (
    <div className={cn(
      "px-4 py-4 border-t border-neutral-200",
      collapsed ? "text-center" : ""
    )}>
      <button
        type="button"
        className={cn(
          "flex items-center text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors",
          collapsed ? "justify-center" : "space-x-2"
        )}
      >
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
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        {!collapsed && (
          <span>{t("common.logout")}</span>
        )}
      </button>
    </div>
  );
  
  return (
    <div
      className={cn(
        dashboardLayoutVariants({
          variant,
          sidebarCollapsible,
        }),
        className
      )}
      {...props}
    >
      <aside
        className={cn(
          sidebarVariants({
            variant: sidebarVariant,
            width: sidebarWidth,
            collapsed,
          })
        )}
      >
        <div className="flex flex-col h-full">
          {sidebarContent || defaultSidebarContent}
          {sidebarFooter || defaultSidebarFooter}
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-h-screen">
        {header || defaultHeader}
        
        <div
          className={cn(
            mainContentVariants({
              padding: mainPadding,
            }),
            "flex-1"
          )}
        >
          {children}
        </div>
        
        {footer || defaultFooter}
      </main>
    </div>
  );
}
