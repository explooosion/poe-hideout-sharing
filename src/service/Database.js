import store from 'store2';
import { db } from './config';
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
    this.dbHideouts = this.db.ref('hideouts');
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
   * Update hideout data
   * @param {HideoutList} hideout
   */
  async onSetHideouts(hideout) {
    await this.db.ref(`hideouts/${hideout.id}`).set(hideout);
  }

  /**
   * Update hideout views by id
   * @param {string} id
   */
  async onUpdateHideoutsViews(_id) {
    // Visited rule save in session
    const hideout = this.hideouts.find(({ id }) => id === _id);
    if (hideout !== undefined && !store.session('visited')) {
      store.session('visited', true);
      await this.db.ref(`hideouts/${_id}`).update({ 'views': hideout.views + 1 });
    }
  }

}


export default Database;
