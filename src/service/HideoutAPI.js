import HideoutDoodads from '../api/HideoutDoodads.json';
import Hideouts from '../api/Hideouts.json';

class HideoutAPI {

  hideoutDoodads = HideoutDoodads;

  hideouts = Hideouts;

  // getDoodadByName(name) {

  // }

  get() {
    return this.hideouts.data || [];
  }

  getDoodads() {
    return this.hideoutDoodads.data || [];
  }

  getDoodadByName(name = '') {
    return this.hideoutDoodads.data.find(hd => hd.Name === name) || {};
  }
}

export default HideoutAPI;
