import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLanguage);
  };
  
  return (
    <button 
      onClick={toggleLanguage}
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:bg-secondary-100",
        className
      )}
    >
      {currentLanguage === 'en' ? '中文' : 'English'}
    </button>
  );
};

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const { t } = useTranslation();
  
  return (
    <div className={cn("relative group", className)}>
      <button className="flex items-center space-x-2 focus:outline-none">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200">
          <span className="text-primary-700 font-medium text-sm">TF</span>
        </div>
        <span className="text-sm font-medium text-neutral-700 hidden sm:inline-block">
          {t('common.userProfile')}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-neutral-500" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
    </div>
  );
};

interface LayoutProps {
  children: ReactNode;
  showHero?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showHero = false }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("min-h-screen flex flex-col", "bg-gray-50")}>
      {/* Top Navbar */}
      <header className={cn("bg-white border-b border-gray-200 sticky top-0 z-10")}>
        <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8")}>
          <div className={cn("flex justify-between items-center h-16")}>
            {/* Logo */}
            <Link href="/" className={cn("flex items-center space-x-2")}>
              <div className={cn("w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center")}>
                <span className={cn("text-white font-bold")}>TF</span>
              </div>
              <span className={cn("text-xl font-bold text-neutral-900")}>ThinkForward</span>
            </Link>
            
            {/* Right side: Language + Profile */}
            <div className={cn("flex items-center space-x-4")}>
              <LanguageSwitcher />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section (Optional) */}
      {showHero && (
        <div className={cn("bg-gradient-to-r from-primary-50 to-secondary-50 py-12")}>
          <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8 text-center")}>
            <h1 className={cn("text-3xl sm:text-4xl font-bold text-neutral-900 mb-4")}>
              {t('common.welcomeMessage')}
            </h1>
            <p className={cn("text-lg text-neutral-700 max-w-2xl mx-auto")}>
              {t('common.welcomeDescription')}
            </p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className={cn("flex-1 py-8")}>
        <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8")}>
          <Card 
            className={cn("max-w-5xl mx-auto shadow-sm border-secondary-200 overflow-visible p-6 sm:p-8")}
          >
            {children}
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={cn("bg-white border-t border-gray-200 py-6")}>
        <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8")}>
          <div className={cn("text-center text-sm text-neutral-500")}>
            © {new Date().getFullYear()} ThinkForward AI. {t('common.allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  );
};
