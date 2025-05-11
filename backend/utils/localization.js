/**
 * Localization utility for translating messages
 */
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next
  .use(Backend)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'fr', 'zh'],
    saveMissing: true,
    debug: process.env.NODE_ENV === 'development',
    ns: ['common', 'errors', 'validation'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

/**
 * Translate a message to the specified locale
 * @param {string} key - Translation key
 * @param {string} locale - Locale code (e.g., 'en', 'fr', 'zh')
 * @param {Object} options - Additional options for translation
 * @returns {string} - Translated message
 */
function translateMessage(key, locale = 'en', options = {}) {
  return i18next.t(key, { lng: locale, ...options });
}

/**
 * Get all translations for a namespace
 * @param {string} namespace - Translation namespace
 * @param {string} locale - Locale code
 * @returns {Object} - Translations object
 */
function getTranslations(namespace = 'common', locale = 'en') {
  return i18next.getResourceBundle(locale, namespace);
}

/**
 * Add a new translation
 * @param {string} locale - Locale code
 * @param {string} namespace - Translation namespace
 * @param {string} key - Translation key
 * @param {string} value - Translation value
 */
function addTranslation(locale, namespace, key, value) {
  i18next.addResource(locale, namespace, key, value);
}

/**
 * Check if a translation exists
 * @param {string} key - Translation key
 * @param {string} locale - Locale code
 * @returns {boolean} - Whether the translation exists
 */
function hasTranslation(key, locale = 'en') {
  return i18next.exists(key, { lng: locale });
}

/**
 * Format date according to locale
 * @param {Date} date - Date to format
 * @param {string} locale - Locale code
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
function formatDate(date, locale = 'en', options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
}

/**
 * Format number according to locale
 * @param {number} number - Number to format
 * @param {string} locale - Locale code
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} - Formatted number
 */
function formatNumber(number, locale = 'en', options = {}) {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format currency according to locale
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (e.g., 'USD', 'CAD')
 * @param {string} locale - Locale code
 * @returns {string} - Formatted currency
 */
function formatCurrency(amount, currency = 'CAD', locale = 'en') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

module.exports = {
  translateMessage,
  getTranslations,
  addTranslation,
  hasTranslation,
  formatDate,
  formatNumber,
  formatCurrency
};
