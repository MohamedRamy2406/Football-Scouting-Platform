import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from './translations.js';

const savedLanguage =
  localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: translations.en,
      ar: translations.ar
    },

    lng: savedLanguage,

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    }
  });

document.documentElement.lang = savedLanguage;

document.documentElement.dir =
  savedLanguage === 'ar'
    ? 'rtl'
    : 'ltr';


    export default i18n;