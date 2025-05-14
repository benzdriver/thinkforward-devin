module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'fr'],
    localeDetection: false, // Changed to false to fix warning
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
