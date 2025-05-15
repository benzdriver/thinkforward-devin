import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { LanguageSwitcher } from './language-switcher';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Navigation - Airportr style */}
      <header className="bg-primary-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-10 h-10 mr-2 rounded-full bg-primary-700 flex items-center justify-center">
                  <span className="font-bold">TF</span>
                </div>
                <span className="text-xl font-bold">{t('app.name')}</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard">
                <span className="nav-link">{t('navigation.dashboard')}</span>
              </Link>
              <Link href="/about">
                <span className="nav-link">{t('about.pageTitle')}</span>
              </Link>
              <Link href="/services">
                <span className="nav-link">{t('footer.services')}</span>
              </Link>
              <Link href="/pricing">
                <span className="nav-link">{t('pricing.pageTitle')}</span>
              </Link>
              <Link href="/contact">
                <span className="nav-link">{t('footer.contact')}</span>
              </Link>
              <LanguageSwitcher />
            </nav>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <button className="btn btn-outline-light">{t('auth.login')}</button>
              </Link>
              <Link href="/auth/register">
                <button className="btn btn-light">{t('auth.register')}</button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/dashboard">
                  <span className="block py-2 nav-link">{t('navigation.dashboard')}</span>
                </Link>
                <Link href="/about">
                  <span className="block py-2 nav-link">{t('about.pageTitle')}</span>
                </Link>
                <Link href="/services">
                  <span className="block py-2 nav-link">{t('footer.services')}</span>
                </Link>
                <Link href="/pricing">
                  <span className="block py-2 nav-link">{t('pricing.pageTitle')}</span>
                </Link>
                <Link href="/contact">
                  <span className="block py-2 nav-link">{t('footer.contact')}</span>
                </Link>
                <div className="py-2">
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/auth/login">
                    <button className="btn btn-outline-light w-full">{t('auth.login')}</button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="btn btn-light w-full">{t('auth.register')}</button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t('about.pageTitle')}</h3>
              <p className="text-neutral-600">{t('about.metaDescription')}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2">
                <li><Link href="/services/express-entry"><span className="text-neutral-600 hover:text-primary-700">{t('footer.expressEntry')}</span></Link></li>
                <li><Link href="/services/pnp"><span className="text-neutral-600 hover:text-primary-700">{t('footer.provincialPrograms')}</span></Link></li>
                <li><Link href="/services/consultation"><span className="text-neutral-600 hover:text-primary-700">{t('footer.consultation')}</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-2">
                <li><Link href="/blog"><span className="text-neutral-600 hover:text-primary-700">{t('footer.blog')}</span></Link></li>
                <li><Link href="/faq"><span className="text-neutral-600 hover:text-primary-700">{t('footer.faq')}</span></Link></li>
                <li><Link href="/contact"><span className="text-neutral-600 hover:text-primary-700">{t('footer.contact')}</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.connect')}</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-neutral-600 hover:text-primary-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-primary-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path>
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-primary-700">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                  </svg>
                </a>
              </div>
              <p className="text-neutral-600">{t('footer.newsletter')}</p>
              <div className="mt-2 flex">
                <input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder') || 'Enter your email'}
                  className="px-4 py-2 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1"
                />
                <button className="bg-primary-700 text-white px-4 py-2 rounded-r-md hover:bg-primary-800">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-neutral-600">
            <p>&copy; {new Date().getFullYear()} ThinkForward AI. {t('footer.allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
