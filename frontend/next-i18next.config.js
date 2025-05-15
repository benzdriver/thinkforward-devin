const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'fr'],
    localeDetection: false,
  },
  debug: process.env.NODE_ENV === 'development',
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
}
