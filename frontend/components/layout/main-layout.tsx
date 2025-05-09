import React, { ReactNode } from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-secondary-200 hidden md:block">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">ThinkForward AI</span>
          </Link>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link 
                href="/dashboard" 
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary-50 rounded-md"
              >
                <svg className="w-5 h-5 mr-3 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/canada/express-entry" 
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary-50 rounded-md"
              >
                <svg className="w-5 h-5 mr-3 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Express Entry
              </Link>
            </li>
            <li>
              <Link 
                href="/canada/pnp" 
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary-50 rounded-md"
              >
                <svg className="w-5 h-5 mr-3 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Provincial Programs
              </Link>
            </li>
            <li>
              <Link 
                href="/canada/documents" 
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary-50 rounded-md"
              >
                <svg className="w-5 h-5 mr-3 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </Link>
            </li>
            <li>
              <Link 
                href="/canada/consultant" 
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary-50 rounded-md"
              >
                <svg className="w-5 h-5 mr-3 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Consultant
              </Link>
            </li>
            <li>
              <Link 
                href="/ai-features" 
                className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-secondary-50 rounded-md"
              >
                <svg className="w-5 h-5 mr-3 text-dark-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Features
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col flex-1">
        <header className="bg-white border-b border-secondary-200 py-4 px-6 md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">ThinkForward AI</span>
            </Link>
            <button className="text-dark-gray hover:text-foreground">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
