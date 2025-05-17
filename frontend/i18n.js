import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './public/locales/en/common.json';
import zhCommon from './public/locales/zh/common.json';
import frCommon from './public/locales/fr/common.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon
      },
      zh: {
        common: zhCommon
      },
      fr: {
        common: frCommon
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
    
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;
