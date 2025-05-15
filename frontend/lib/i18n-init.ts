import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18n as i18nConfig } from '../next-i18next.config';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(HttpBackend)
    .use(LanguageDetector)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      supportedLngs: ['en', 'zh', 'fr'],
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['path', 'cookie', 'navigator'],
        lookupFromPathIndex: 0,
        caches: ['cookie'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      debug: false,
    });
}

export default i18n;
