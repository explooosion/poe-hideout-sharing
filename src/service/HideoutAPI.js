import HideoutDoodads from '../api/HideoutDoodads.json';
import Hideouts from '../api/Hideouts.json';

class HideoutAPI {

  hideoutDoodads = HideoutDoodads;

  hideouts = Hideouts;

  get() {
    return this.hideouts.data || [];
  }

  getDoodads() {
    return this.hideoutDoodads.data || [];
  }

  /**
   * Get by hash
   * @param {*} hash
   */
  getDoodadByHash(hash = '') {
    return this.hideoutDoodads.data.find(hd => String(hd.Hash) === String(hash)) || {};
  }
}

export default HideoutAPI;
