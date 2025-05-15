import * as React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface LanguageSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dropdown" | "buttons";
  size?: "sm" | "md" | "lg";
}

export function LanguageSwitcher({
  className,
  variant = "buttons",
  size = "sm",
  ...props
}: LanguageSwitcherProps) {
  const router = useRouter();
  const { t } = useTranslation("common");
  
  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "fr", name: "Français" }
  ];
  
  const changeLanguage = (locale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
  };
  
  return (
    <div 
      className={cn(
        "flex items-center space-x-1",
        className
      )}
      {...props}
    >
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={router.locale === lang.code ? "primary" : "outline"}
          size={size}
          onClick={() => changeLanguage(lang.code)}
          className={cn(
            "px-2 py-1",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
