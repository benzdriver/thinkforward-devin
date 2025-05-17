const path = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'fr'],
    localeDetection: false,
  },
  debug: process.env.NODE_ENV === 'development',
  defaultNS: 'common',
  ns: ['common'],
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: true,
  serializeConfig: false,
  partialBundledLanguages: false,
  saveMissing: false,
  strictMode: true,
  load: 'currentOnly',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
  },
};
