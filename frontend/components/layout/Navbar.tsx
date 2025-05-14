import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname === path ? 'nav-link-active' : '';
  };
  
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Link href="/">
              <span className="logo">ThinkForward AI</span>
            </Link>
          </div>
          
          <div className="navbar-links">
            <Link href="/">
              <span className={`nav-link ${isActive('/')}`}>Home</span>
            </Link>
            <Link href="/dashboard">
              <span className={`nav-link ${isActive('/dashboard')}`}>Dashboard</span>
            </Link>
            <Link href="/about">
              <span className={`nav-link ${isActive('/about')}`}>About</span>
            </Link>
            <Link href="/pricing">
              <span className={`nav-link ${isActive('/pricing')}`}>Pricing</span>
            </Link>
          </div>
          
          <div className="navbar-auth">
            <Link href="/login">
              <button className="btn btn-secondary btn-sm">Login</button>
            </Link>
            <Link href="/register">
              <button className="btn btn-primary btn-sm">Register</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
