import HideoutDoodads from '../api/HideoutDoodads.json';
import Hideouts from '../api/Hideouts.json';
import HideoutszhTW from '../api/HideoutszhTW.json';
import HideoutszhCN from '../api/HideoutszhCN.json';

class HideoutAPI {

  hideoutDoodads = HideoutDoodads;

  hideouts = Hideouts;

  hideoutszhCN = HideoutszhCN;

  hideoutszhTW = HideoutszhTW;

  /**
   * Get hideout place data
   * @param {string} locale
   */
  get(locale = 'en') {
    let LocaleData = [];
    // Ref: src/i18n.js resources
    switch (locale) {
      default:
      case 'en': LocaleData = this.hideouts.data || []; break;
      case 'zhTW': LocaleData = this.hideoutszhTW.data || []; break;
      case 'zhCN': LocaleData = this.hideoutszhCN.data || []; break;
    }

    // Default
    if (locale === 'en') return LocaleData;

    return this.hideouts.data.map(h => {
      const res = LocaleData.find(tw => tw.Name === h.Name);
      if (res) {
        return {
          ...h,
          Name: res.CName.replace('藏身處-', ''),
        }
      } else {
        console.warn('faild to change hideout type locale', h);
        return h;
      }
    }) || [];
  }

  /**
   * Get hideout place data by hash
   * @param {string} hash
   * @param {string} locale
   */
  getByHash(hash = '', locale = 'en') {
    return this.get(locale).find(hd => String(hd.Hash) === String(hash)) || {};
  }

  /**
   * Get hideout object
   */
  getDoodads() {
    return this.hideoutDoodads.data || [];
  }

  /**
   * Get hideout object by hash
   * @param {string} hash
   */
  getDoodadByHash(hash = '') {
    return this.hideoutDoodads.data.find(hd => String(hd.Hash) === String(hash)) || {};
  }
}

export default HideoutAPI;
