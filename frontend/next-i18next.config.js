module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'fr'],
    localeDetection: false,
  },
  debug: true,
  fallbackLng: 'en',
  load: 'languageOnly',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
}
