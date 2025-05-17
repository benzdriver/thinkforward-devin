import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import enTranslation from '../public/locales/en/common.json';
import zhTranslation from '../public/locales/zh/common.json';
import frTranslation from '../public/locales/fr/common.json';

let i18nInstance = i18n;

if (typeof window !== 'undefined') {
  const i18nextInstance = (window as any).__NEXT_I18NEXT_UNIVERSAL_CACHE?.i18n || i18n;
  i18nInstance = i18nextInstance;
  
  if (!i18nextInstance.isInitialized) {
    console.log('Initializing i18next client...');
    
    (window as any).i18next = i18nextInstance;
    
    i18nextInstance
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common'],
        resources: {
          en: {
            common: enTranslation
          },
          zh: {
            common: zhTranslation
          },
          fr: {
            common: frTranslation || {} // Fallback if file doesn't exist
          }
        },
        interpolation: {
          escapeValue: false, // React already escapes values
        },
        react: {
          useSuspense: false,
        },
        detection: {
          order: ['querystring', 'localStorage', 'cookie', 'navigator'],
          caches: ['localStorage', 'cookie'],
          lookupQuerystring: 'lng',
          lookupLocalStorage: 'i18nextLng',
        },
        preload: ['en', 'zh', 'fr'],
        load: 'currentOnly',
        partialBundledLanguages: false,
        saveMissing: false,
        parseMissingKeyHandler: (key) => {
          console.warn(`Missing translation key: ${key}`);
          return key;
        },
      }, (err) => {
        if (err) {
          console.error('i18n initialization error:', err);
        } else {
          console.log('i18n initialized successfully with language:', i18nextInstance.language);
          console.log('Available resources:', Object.keys(i18nextInstance.options.resources || {}));
          
          i18nextInstance.reloadResources().then(() => {
            console.log('Translations reloaded successfully');
            
            console.log('EN translations available:', 
              i18nextInstance.hasResourceBundle('en', 'common'), 
              Object.keys(i18nextInstance.getResourceBundle('en', 'common') || {}).length);
            
            console.log('ZH translations available:', 
              i18nextInstance.hasResourceBundle('zh', 'common'),
              Object.keys(i18nextInstance.getResourceBundle('zh', 'common') || {}).length);
              
            console.log('FR translations available:', 
              i18nextInstance.hasResourceBundle('fr', 'common'),
              Object.keys(i18nextInstance.getResourceBundle('fr', 'common') || {}).length);
          }).catch(err => {
            console.error('Error reloading translations:', err);
          });
        }
      });
  } else {
    console.log('i18next already initialized with language:', i18nextInstance.language);
    
    if (!i18nextInstance.hasResourceBundle('en', 'common')) {
      i18nextInstance.addResourceBundle('en', 'common', enTranslation);
    }
    if (!i18nextInstance.hasResourceBundle('zh', 'common')) {
      i18nextInstance.addResourceBundle('zh', 'common', zhTranslation);
    }
    if (!i18nextInstance.hasResourceBundle('fr', 'common')) {
      i18nextInstance.addResourceBundle('fr', 'common', frTranslation || {});
    }
    
    i18nextInstance.reloadResources().then(() => {
      console.log('Translations reloaded successfully for existing i18n instance');
    }).catch(err => {
      console.error('Error reloading translations for existing i18n instance:', err);
    });
  }
}

export default i18nInstance;
