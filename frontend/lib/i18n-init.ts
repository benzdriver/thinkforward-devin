import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import nextI18NextConfig from '../next-i18next.config';

const resources = {
  en: {
    common: require('../public/locales/en/common.json')
  },
  zh: {
    common: require('../public/locales/zh/common.json')
  },
  fr: {
    common: require('../public/locales/fr/common.json')
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: nextI18NextConfig.i18n.defaultLocale,
    debug: process.env.NODE_ENV === 'development',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
    preload: nextI18NextConfig.i18n.locales,
    initImmediate: false
  });

export default i18n;
