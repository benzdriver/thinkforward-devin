/**
 * 本地化中间件
 * 用于处理请求的语言偏好和本地化设置
 */

const { localization } = require('../utils/localization');

/**
 * 本地化中间件
 * 检测请求中的语言偏好，并设置相应的本地化设置
 */
const localeMiddleware = (req, res, next) => {
  try {
    const acceptLanguage = req.headers['accept-language'] || '';
    
    const queryLang = req.query.lang;
    
    const sessionLang = req.session && req.session.preferredLanguage;
    
    const userLang = req.user && req.user.preferredLanguage;
    
    let locale = queryLang || userLang || sessionLang || parseAcceptLanguage(acceptLanguage) || 'en';
    
    locale = validateLocale(locale);
    
    req.locale = locale;
    
    if (req.user && queryLang && req.user.preferredLanguage !== queryLang) {
      updateUserLanguagePreference(req.user, queryLang);
    }
    
    if (req.session && queryLang) {
      req.session.preferredLanguage = queryLang;
    }
    
    res.set('Content-Language', locale);
    
    res.locals.t = (key, params) => localization.translate(key, locale, params);
    res.locals.locale = locale;
    
    next();
  } catch (error) {
    console.error('本地化中间件错误:', error);
    req.locale = 'en';
    res.locals.t = (key, params) => localization.translate(key, 'en', params);
    res.locals.locale = 'en';
    next();
  }
};

/**
 * 解析Accept-Language头
 * @param {String} acceptLanguage - Accept-Language头的值
 * @returns {String} - 首选语言代码
 */
const parseAcceptLanguage = (acceptLanguage) => {
  if (!acceptLanguage) return null;
  
  const languages = acceptLanguage.split(',')
    .map(lang => {
      const [code, quality] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0], // 只取主语言代码
        quality: quality ? parseFloat(quality) : 1.0
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  return languages.length > 0 ? languages[0].code : null;
};

/**
 * 验证语言代码
 * @param {String} locale - 语言代码
 * @returns {String} - 有效的语言代码
 */
const validateLocale = (locale) => {
  const supportedLocales = ['en', 'fr', 'zh'];
  
  if (supportedLocales.includes(locale)) {
    return locale;
  }
  
  const mainLocale = locale.split('-')[0];
  if (supportedLocales.includes(mainLocale)) {
    return mainLocale;
  }
  
  return 'en';
};

/**
 * 更新用户的语言偏好
 * @param {Object} user - 用户对象
 * @param {String} locale - 语言代码
 */
const updateUserLanguagePreference = async (user, locale) => {
  try {
    const validLocale = validateLocale(locale);
    
    user.preferredLanguage = validLocale;
    await user.save();
  } catch (error) {
    console.error('更新用户语言偏好失败:', error);
  }
};

module.exports = {
  localeMiddleware
};
