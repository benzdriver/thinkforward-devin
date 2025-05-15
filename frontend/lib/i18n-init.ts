import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nextI18NextConfig from '../next-i18next.config';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: nextI18NextConfig.i18n.defaultLocale,
    debug: process.env.NODE_ENV === 'development',
    ns: ['common'], // Default namespace
    defaultNS: 'common',
    resources: {
      en: {
        common: require('../public/locales/en/common.json')
      }
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
