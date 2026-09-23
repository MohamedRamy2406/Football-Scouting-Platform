import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from './translations.js';

const savedLanguage =
  localStorage.getItem('language') || 'en';

function updateDocumentLanguage(language) {
  document.documentElement.lang = language;

  document.documentElement.dir =
    language === 'ar'
      ? 'rtl'
      : 'ltr';
}

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

/*
 * Keep the HTML language and direction synchronized
 * whenever the user changes the application language.
 */
i18n.on('languageChanged', (language) => {
  localStorage.setItem('language', language);

  updateDocumentLanguage(language);
});

updateDocumentLanguage(savedLanguage);

export default i18n;