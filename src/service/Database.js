import _ from 'lodash';

import Session from './Session';
import { db, REF_PICK } from './config';
import { formatHideoutObject } from '../utils/format';

class Database {

  hideouts = [];

  constructor() {
    this.db = db;
  }

  get() {
    return this.hideouts || [];
  }

  /**
   * Get hideouts by hideout id
   * @param {string} id
   */
  getById(id = '') {
    return this.hideouts.find((hideout) => hideout.id === id) || null;
  }

  /**
   * Get hideouts by user id
   * @param {string} uid
   */
  getByUserId(uid = '') {
    return this.hideouts.filter((hideout) => hideout.authorId === uid) || [];
  }

  /**
   * Download file by fileContent
   * @param {string} fileName
   * @param {string} fileContent
   */
  getFileByfileContent(fileName = '', fileContent = '') {

    // Rebuild Constructor
    const { Objects, ...Args } = JSON.parse(fileContent);

    const Title = Object.keys(Args).map(o => {
      return (`${o} = ${o === 'Hideout Hash' ? _.get(Args, o) : JSON.stringify(_.get(Args, o))}\n`);
    })

    const Files = Objects.map(o => {
      const { Name, ...args } = o;
      return `${Name} = ${formatHideoutObject(args)}\n`;
    });

    // Combine hideout object
    const filesTest = [...Title, ['\n'], ...Files];

    // File Download
    const fileType = 'text';
    // eslint-disable-next-line no-underscore-dangle
    const _fileName = fileName + '.hideout';
    const blob = new Blob(filesTest, { type: fileType });

    const a = document.createElement('a');
    a.download = _fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  /**
   * Hideouts handler
   */
  onHideoutsSnapshot() {
    const SORTKEY = 'timestamp';
    this.dbHideouts = this.db.ref(`hideouts${REF_PICK}`);
    this.dbHideouts.on('value', snapshot => {
      const datas = snapshot.val() || [];
      this.hideouts = Object.keys(datas)
        .map(key => datas[key])
        .sort((a, b) => (a[SORTKEY] < b[SORTKEY]) ? 1 : ((b[SORTKEY] < a[SORTKEY]) ? -1 : 0));
      // console.info('snapshot', this.hideouts);
    });
  }

  /**
   * Create hideout data
   * @param {HideoutList} hideout
   */
  async onCreateHideout(hideout = { id: null }) {
    if (!hideout.id) return;
    await this.db.ref(`hideouts${REF_PICK}/${hideout.id}`).set(hideout);
  }

  /**
   * Update hideout data
   * @param {HideoutList} hideout
   */
  async onUpdateHideout(hideout = { id: null }) {
    if (!hideout.id) return;
    await this.db.ref(`hideouts${REF_PICK}/${hideout.id}`).update(hideout);
  }

  /**
   * Delete hideout data
   * @param {string} id
   */
  async onDeleteHideout(id = null) {
    if (!id) return;
    await this.db.ref(`hideouts${REF_PICK}/${id}`).remove();
  }

  /**
   * Update hideout views by id
   * @param {string} id
   */
  async onUpdateHideoutViews(_id) {
    // Visited rule save in session
    const hideout = this.hideouts.find(({ id }) => id === _id);
    if (hideout !== undefined && !Session.get(`v-${_id}`)) {
      Session.set(`v-${_id}`, true);
      await this.db.ref(`hideouts${REF_PICK}/${_id}`).update({ 'views': hideout.views + 1 });
    }
  }

  /**
   * Update hideout favorite by id
   * @param {string} id
   */
  async onUpdateHideoutFavorite(_id) {
    // Favorited rule save in session
    const hideout = this.hideouts.find(({ id }) => id === _id);
    if (hideout !== undefined) {
      await this.db.ref(`hideouts${REF_PICK}/${_id}`).update({ 'favorite': hideout.favorite + 1 });
    }
  }

  /**
   * Update hideout download by id
   * @param {string} id
   */
  async onUpdateHideoutDownload(_id) {
    // Favorited rule save in session
    const hideout = this.hideouts.find(({ id }) => id === _id);
    if (hideout !== undefined) {
      await this.db.ref(`hideouts${REF_PICK}/${_id}`).update({ 'download': hideout.download + 1 });
    }
  }
}

export default Database;
