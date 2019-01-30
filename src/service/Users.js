import { db, REF_PICK } from './config';
// import { setHideouts } from '../actions';

class Users {

  users = [];

  constructor() {
    this.db = db;
    this.onUsersSnapshot();
  }

  get() {
    return this.users || [];
  }

  /**
   * Users handler
   */
  onUsersSnapshot() {
    this.dbUsers = this.db.ref(`users${REF_PICK}`);
    this.dbUsers.on('value', snapshot => {
      const datas = snapshot.val() || [];
      this.users = Object.keys(datas).map(key => datas[key]);
    });
  }

  /**
   * Create user
   * @param {object} user
   */
  async onCreateUser(user = {}) {
    if (!Object.keys(user).length === 0) return;
    console.log('onCreateUser', user);
    await this.db.ref(`users${REF_PICK}/${user.uid}`).set(user);
  }

  /**
   * Update user
   * @param {User} user
   */
  async onUpdateUser(user = {}) {
    if (!Object.keys(user).length === 0) return;
    console.log('onUpdateUser', user);
    await this.db.ref(`users${REF_PICK}/${user.uid}`).update(user);
  }
}


export default Users;
