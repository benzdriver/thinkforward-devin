import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { i18n as i18nConfig } from '../next-i18next.config';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(HttpBackend)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      supportedLngs: ['en', 'zh', 'fr'],
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
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
