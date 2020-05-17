import { getI18n } from 'react-i18next';
import moment from 'moment';

require('moment/locale/zh-tw');
require('moment/locale/zh-cn');
// require("moment/min/locales.min");

/**
 * 修改 moment 語系
 */
export function changeMomentLocale() {
  switch (getI18n().language) {
    case 'TW':
      moment.locale('zh-tw');
      break;
    case 'CN':
      moment.locale('zh-cn');
      break;
    case 'EN':
    default:
      moment.locale('en-us');
      break;
  }
}
