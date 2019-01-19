import { db } from './config';
// import HideoutList from '../interface/HideoutList';

class Database {

  constructor() {
    this.db = db;

    this.onUsersSnapshot();
    this.onHideoutsSnapshot();
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
  onHideoutsSnapshot() {
    this.dbHideouts = this.db.ref('hideouts');
    this.dbHideouts.on('value', snapshot => {
      this.hideouts = snapshot.val();
      console.info('hideouts', snapshot.val());
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
    return this.db.ref(`hideouts/${hideout.id}`).set(hideout).then(result => { return result });
  }

}

export default Database;
