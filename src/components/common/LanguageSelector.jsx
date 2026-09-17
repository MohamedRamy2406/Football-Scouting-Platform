import { useEffect, useState } from 'react';

import { useTranslation }
  from 'react-i18next';


export default function LanguageSelector() {

  const { i18n } =
    useTranslation();


  const [language,
    setLanguage] =
    useState(
      i18n.language === 'ar'
        ? 'ar'
        : 'en'
    );


  useEffect(() => {

    const currentLanguage =
      i18n.language === 'ar'
        ? 'ar'
        : 'en';


    setLanguage(
      currentLanguage
    );


    document.documentElement.lang =
      currentLanguage;


    document.documentElement.dir =
      currentLanguage === 'ar'
        ? 'rtl'
        : 'ltr';

  }, [i18n.language]);


  const changeLanguage =
    async (newLanguage) => {

      await i18n.changeLanguage(
        newLanguage
      );


      localStorage.setItem(
        'language',
        newLanguage
      );


      setLanguage(
        newLanguage
      );


      document.documentElement.lang =
        newLanguage;


      document.documentElement.dir =
        newLanguage === 'ar'
          ? 'rtl'
          : 'ltr';

    };


  return (

    <div className="language-selector">


      <button
        type="button"
        className={
          language === 'en'
            ? 'language-active'
            : ''
        }
        onClick={() =>
          changeLanguage('en')
        }
      >

        🇬🇧 English

      </button>


      <span className="language-divider">
        |
      </span>


      <button
        type="button"
        className={
          language === 'ar'
            ? 'language-active'
            : ''
        }
        onClick={() =>
          changeLanguage('ar')
        }
      >

        🇪🇬 العربية

      </button>


    </div>

  );

}