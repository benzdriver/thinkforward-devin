import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
];

export const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const closeDropdown = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <span>{currentLanguage.code.toUpperCase()}</span>
        <svg 
          className="dropdown-icon" 
          width="12" 
          height="12" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="dropdown-overlay"
            onClick={closeDropdown}
          ></div>
          <div className="language-dropdown">
            <div className="language-options">
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={router.asPath}
                  locale={language.code}
                  legacyBehavior
                >
                  <a 
                    className={`language-option ${
                      router.locale === language.code ? 'active' : ''
                    }`}
                    onClick={closeDropdown}
                  >
                    {language.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
