import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSettingsStore, Language } from '../../lib/store/zustand/useSettingsStore';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { i18n } = useTranslation('common');
  const router = useRouter();
  const { language, setLanguage } = useSettingsStore();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && language && i18n.language !== language) {
      console.log('Initializing language from settings store:', language);
      i18n.changeLanguage(language).then(() => {
        console.log('Language changed to:', i18n.language);
      }).catch(err => {
        console.error('Error changing language:', err);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && language && !isChangingLanguage) {
      console.log('Language changed in settings store:', language);
      setIsChangingLanguage(true);
      
      i18n.changeLanguage(language).then(() => {
        console.log('Language changed to:', i18n.language);
        if (router.locale !== language) {
          const { pathname, asPath, query } = router;
          router.push({ pathname, query }, asPath, { locale: language });
        }
        setIsChangingLanguage(false);
      }).catch(err => {
        console.error('Error changing language:', err);
        setIsChangingLanguage(false);
      });
    }
  }, [language, i18n, router, isChangingLanguage]);

  useEffect(() => {
    if (router.locale && router.locale !== language && !isChangingLanguage) {
      console.log('Router locale changed:', router.locale);
      if (router.locale === 'en' || router.locale === 'zh' || router.locale === 'fr') {
        setLanguage(router.locale as Language);
      }
    }
  }, [router.locale, language, setLanguage, isChangingLanguage]);

  return <>{children}</>;
};
