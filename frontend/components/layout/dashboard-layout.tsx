import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { LanguageSwitcher } from "../ui/language-switcher";

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
  "flex flex-col transition-all duration-300 ease-in-out shadow-xl",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-900 border-r border-neutral-200",
        dark: "bg-neutral-900 text-white border-r border-neutral-800",
        primary: "bg-gradient-primary text-white",
        brand: "bg-gradient-primary text-white",
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
      variant: "primary",
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
  sidebarVariant = "primary",
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
    <div className="flex items-center space-x-2 px-4 py-6">
      <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-md">
        <span className="text-white font-bold text-xl">TF</span>
      </div>
      {!collapsed && (
        <span className="text-xl font-bold text-white ml-2">ThinkForward</span>
      )}
    </div>
  );
  
  const defaultHeader = (
    <div className={cn(
      "flex items-center justify-between px-6 py-3 h-16 border-b border-neutral-200 bg-white shadow-sm",
      headerFixed && "sticky top-0 z-10"
    )}>
      <div className="flex items-center space-x-4">
        {sidebarCollapsible && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            aria-label={String(collapsed ? t("common.expandSidebar", "Expand Sidebar") : t("common.collapseSidebar", "Collapse Sidebar"))}
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
              className="text-neutral-700"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-medium text-neutral-900">{t("dashboard.title")}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <LanguageSwitcher size="sm" />
        
        <button
          type="button"
          className="p-2 rounded-md hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 relative"
          aria-label={String(t("common.notifications", "Notifications"))}
        >
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
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
            className="text-neutral-700"
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
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-colored">
              <span className="text-white font-medium">U</span>
            </div>
            {!collapsed && (
              <span className="text-sm font-medium ml-2">{String(t("common.userProfile", "User Profile"))}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
  
  const defaultFooter = (
    <div className={cn(
      "px-6 py-4 border-t border-neutral-200 text-sm text-neutral-500 bg-white",
      footerFixed && "sticky bottom-0 z-10"
    )}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>
          © {new Date().getFullYear()} ThinkForward AI. {String(t("common.allRightsReserved", "All Rights Reserved"))}
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/terms" className="hover:text-primary-600 transition-colors">
            {String(t("common.terms", "Terms"))}
          </Link>
          <Link href="/privacy" className="hover:text-primary-600 transition-colors">
            {String(t("common.privacy", "Privacy"))}
          </Link>
          <Link href="/help" className="hover:text-primary-600 transition-colors">
            {String(t("common.help", "Help"))}
          </Link>
        </div>
      </div>
    </div>
  );
  
  const renderNavigationItems = () => {
    return (
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navigationItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                "text-white hover:bg-white/10 shadow-sm",
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
                    <span className="ml-auto bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
                  )}
                </>
              )}
            </Link>
            
            {!collapsed && item.children && item.children.length > 0 && (
              <div className="pl-10 space-y-1.5">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-xl text-white/90 hover:bg-white/10 transition-all duration-200 space-x-3"
                  >
                    {child.icon && (
                      <span className="shrink-0">{child.icon}</span>
                    )}
                    <span className="flex-1">{child.title}</span>
                    {child.badge && (
                      <span className="ml-auto bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">{child.badge}</span>
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
        <nav className="flex-1 px-3 py-6 space-y-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
              "text-white hover:bg-white/10 shadow-sm",
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
              <span className="ml-3">{String(t("dashboard.overview", "Overview"))}</span>
            )}
          </Link>
          
          <Link
            href="/profile/build/form"
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
              "text-white hover:bg-white/10 shadow-sm",
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
              <span className="ml-3">{String(t("dashboard.profile", "Profile"))}</span>
            )}
          </Link>
          
          <Link
            href="/assessment/start"
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
              "text-white hover:bg-white/10 shadow-sm",
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {!collapsed && (
              <span className="ml-3">{String(t("dashboard.assessment", "Assessment"))}</span>
            )}
          </Link>
          
          <Link
            href="/consultants"
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
              "text-white hover:bg-white/10 shadow-sm",
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {!collapsed && (
              <span className="ml-3">{String(t("dashboard.consultants", "Consultants"))}</span>
            )}
          </Link>
          
          <Link
            href="/documents"
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
              "text-white hover:bg-white/10 shadow-sm",
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {!collapsed && (
              <span className="ml-3">{String(t("dashboard.documents", "Documents"))}</span>
            )}
          </Link>
          
          <Link
            href="/settings"
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
              "text-white hover:bg-white/10 shadow-sm",
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
              <span className="ml-3">{String(t("dashboard.settings", "Settings"))}</span>
            )}
          </Link>
        </nav>
      )}
    </>
  );
  
  const defaultSidebarFooter = (
    <div className={cn(
      "px-4 py-4 border-t border-white/10",
      collapsed ? "text-center" : ""
    )}>
      <Link
        href="/auth/logout"
        className={cn(
          "flex items-center text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 rounded-xl px-3 py-2.5 shadow-sm",
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
          <span className="ml-2">{String(t("common.logout", "Logout"))}</span>
        )}
      </Link>
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
