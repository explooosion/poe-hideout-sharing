import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

import { COOKIE_I18N, getCookie } from './utils/Cookie';

// the translations
// (tip move them in a JSON file and import them)
import US from './i18n/enUS';
import TW from './i18n/zhTW';
import CN from './i18n/zhCN';

const resources = { US, TW, CN };

const lng = getCookie(COOKIE_I18N) || 'US';

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,

    lng,

    keySeparator: false, // we do not use keys in form messages.welcome

    fallbackLng: 'US',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
