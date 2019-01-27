import store from 'store2';
import { db, REF_PICK } from './config';
// import HideoutList from '../interface/HideoutList';
import { setHideouts } from '../actions';

class Database {

  hideouts = [];

  constructor() {
    this.db = db;
    // this.onUsersSnapshot();
  }

  /**
   * Users handler
   */
  onUsersSnapshot() {
    this.dbUsers = this.db.ref('users');
    this.dbUsers.on('value', snapshot => {
      this.users = snapshot.val();
      console.info('users', snapshot.val());
    });
  }

  /**
   * Hideouts handler
   */
  onHideoutsSnapshot(dispatch) {
    const SORTKEY = 'timestamp';
    this.dbHideouts = this.db.ref(`hideouts${REF_PICK}`);
    this.dbHideouts.on('value', snapshot => {
      const datas = snapshot.val() || [];
      this.hideouts = Object.keys(datas)
        .map(key => datas[key])
        .sort((a, b) => (a[SORTKEY] < b[SORTKEY]) ? 1 : ((b[SORTKEY] < a[SORTKEY]) ? -1 : 0));
      console.info('snapshot', this.hideouts);
      dispatch(setHideouts(this.hideouts));
    });
  }

  /**
   * Update user data
   */
  onSetUsers() {
    const user = {
      username: 'robby',
      email: 'robby@mail.com',
    }
    this.db.ref(`users/${user.username}`).set(user);
  }

  /**
   * Create or update hideout data
   * @param {HideoutList} hideout
   * @param {boolean} isCreate
   */
  async onSetHideouts(hideout, isCreate) {
    if (isCreate) {
      await this.db.ref(`hideouts${REF_PICK}/${hideout.id}`).set(hideout);
    } else {
      await this.db.ref(`hideouts${REF_PICK}/${hideout.id}`).update(hideout);
    }
  }

  /**
   * Delete hideout data
   * @param {string} id
   */
  async onDeleteHideouts(id) {
    await this.db.ref(`hideouts${REF_PICK}/${id}`).remove();
  }

  /**
   * Update hideout views by id
   * @param {string} id
   */
  async onUpdateHideoutViews(_id) {
    // Visited rule save in session
    const hideout = this.hideouts.find(({ id }) => id === _id);
    if (hideout !== undefined && !store.session(`views-${_id}`)) {
      store.session(`views-${_id}`, true);
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
