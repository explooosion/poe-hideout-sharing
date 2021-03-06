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
  get(locale = 'US') {
    let currentData = [];
    // Ref: src/i18n.js resources
    switch (locale) {
      default:
      case 'US': currentData = this.hideouts.data || []; break;
      case 'TW': currentData = this.hideoutszhTW.data || []; break;
      case 'CN': currentData = this.hideoutszhCN.data || []; break;
    }

    // Default
    if (locale === 'US') return currentData;

    return this.hideouts.data.map(h => {
      const res = currentData.find(c => c.Name === h.Name);
      if (res) {
        return {
          ...h,
          // Name: res.CName.replace('藏身處-', ''),
          Name: res.CName,
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
  getByHash(hash = '', locale = 'US') {
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
