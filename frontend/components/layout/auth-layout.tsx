import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const authLayoutVariants = cva(
  "flex min-h-screen",
  {
    variants: {
      variant: {
        default: "bg-white",
        gradient: "bg-gradient-to-br from-primary-50 to-secondary-50",
        image: "bg-cover bg-center",
      },
      contentPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
        center: "flex-col items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      contentPosition: "left",
    },
  }
);

const sidebarVariants = cva(
  "relative hidden lg:flex flex-col",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white",
        light: "bg-primary-50 text-primary-900",
        dark: "bg-neutral-900 text-white",
        image: "bg-cover bg-center text-white",
      },
      width: {
        sm: "lg:w-1/4",
        md: "lg:w-1/3",
        lg: "lg:w-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
      width: "md",
    },
  }
);

const contentVariants = cva(
  "flex flex-col w-full",
  {
    variants: {
      width: {
        sm: "lg:w-3/4",
        md: "lg:w-2/3",
        lg: "lg:w-1/2",
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
    },
    defaultVariants: {
      width: "md",
      padding: "lg",
    },
  }
);

export interface AuthLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof authLayoutVariants> {
  logo?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  sidebarVariant?: VariantProps<typeof sidebarVariants>["variant"];
  sidebarWidth?: VariantProps<typeof sidebarVariants>["width"];
  sidebarImage?: string;
  contentWidth?: VariantProps<typeof contentVariants>["width"];
  contentPadding?: VariantProps<typeof contentVariants>["padding"];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  backgroundImage?: string;
}

export function AuthLayout({
  className,
  children,
  variant,
  contentPosition,
  logo,
  sidebarContent,
  sidebarFooter,
  sidebarVariant = "default",
  sidebarWidth = "md",
  sidebarImage,
  contentWidth = "md",
  contentPadding = "lg",
  header,
  footer,
  backgroundImage,
  ...props
}: AuthLayoutProps) {
  const { t } = useTranslation("common");
  
  const hasSidebar = contentPosition !== "center" && (sidebarContent || sidebarImage);
  
  const defaultLogo = (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
        <span className="text-white font-bold">TF</span>
      </div>
      <span className="text-xl font-bold">ThinkForward</span>
    </div>
  );
  
  const defaultHeader = (
    <div className="flex justify-between items-center w-full mb-8">
      <Link href="/" className="flex items-center">
        {logo || defaultLogo}
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/auth/login" className="text-sm font-medium hover:text-primary-600 transition-colors">
          {t("auth.login")}
        </Link>
        <Link href="/auth/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
          {t("auth.register")}
        </Link>
      </div>
    </div>
  );
  
  const defaultFooter = (
    <div className="mt-8 pt-8 border-t border-neutral-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-neutral-500">
          © {new Date().getFullYear()} ThinkForward AI. {t("common.allRightsReserved")}
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
            {t("common.terms")}
          </Link>
          <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
            {t("common.privacy")}
          </Link>
          <Link href="/contact" className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
            {t("common.contact")}
          </Link>
        </div>
      </div>
    </div>
  );
  
  const defaultSidebarContent = (
    <div className="flex flex-col justify-center items-center h-full p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">{t("auth.welcomeBack")}</h1>
      <p className="text-lg opacity-80 mb-8">{t("auth.welcomeMessage")}</p>
      <div className="w-full max-w-md">
        <Image
          src="/images/auth-illustration.svg"
          alt="Authentication"
          width={400}
          height={300}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
  
  const defaultSidebarFooter = (
    <div className="p-8 text-center">
      <p className="text-sm opacity-80">{t("auth.needHelp")} <Link href="/contact" className="underline hover:opacity-100 transition-opacity">{t("auth.contactSupport")}</Link></p>
    </div>
  );
  
  return (
    <div
      className={cn(
        authLayoutVariants({
          variant,
          contentPosition,
        }),
        className
      )}
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: variant === 'default' ? 'white' : 
                        variant === 'gradient' ? '#F8FAFC' : undefined,
        flexDirection: contentPosition === 'left' ? 'row' : 
                       contentPosition === 'right' ? 'row-reverse' : 'column',
        alignItems: contentPosition === 'center' ? 'center' : undefined,
        justifyContent: contentPosition === 'center' ? 'center' : undefined,
        ...(variant === "image" && backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
        ...props.style
      }}
      {...props}
    >
      {hasSidebar && (
        <div
          className={cn(
            sidebarVariants({
              variant: sidebarVariant,
              width: sidebarWidth,
            })
          )}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: sidebarVariant === 'default' ? 'white' : 
                             sidebarVariant === 'light' ? '#F0F9FF' :
                             sidebarVariant === 'dark' ? '#0F172A' : undefined,
            color: sidebarVariant === 'default' || sidebarVariant === 'light' ? '#0F172A' : 'white',
            borderRight: '1px solid #E2E8F0',
            width: sidebarWidth === 'sm' ? '25%' : 
                   sidebarWidth === 'md' ? '33.333%' : 
                   sidebarWidth === 'lg' ? '50%' : '33.333%',
            ...(sidebarVariant === "image" && sidebarImage
              ? { backgroundImage: `url(${sidebarImage})` }
              : {})
          }}
        >
          <div className="flex flex-col justify-between h-full" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div className="flex-1" style={{ flex: 1 }}>
              {sidebarContent || defaultSidebarContent}
            </div>
            <div>
              {sidebarFooter || defaultSidebarFooter}
            </div>
          </div>
        </div>
      )}
      
      <div
        className={cn(
          contentVariants({
            width: contentWidth,
            padding: contentPadding,
          }),
          "flex flex-col min-h-screen"
        )}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: contentWidth === 'sm' ? '75%' : 
                 contentWidth === 'md' ? '66.667%' : 
                 contentWidth === 'lg' ? '50%' : '66.667%',
          padding: contentPadding === 'sm' ? '1rem' :
                  contentPadding === 'md' ? '1.5rem' :
                  contentPadding === 'lg' ? '2rem' :
                  contentPadding === 'xl' ? '3rem' : '2rem',
          minHeight: '100vh',
          flex: 1
        }}
      >
        <div className="flex-1 flex flex-col" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {header || (contentPosition !== "center" && defaultHeader)}
          
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full" 
               style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '28rem', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
          
          {footer || (contentPosition !== "center" && defaultFooter)}
        </div>
      </div>
    </div>
  );
}
