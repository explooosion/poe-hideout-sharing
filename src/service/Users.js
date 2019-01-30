import { db, REF_PICK } from './config';
import Session from './Session';
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

      // Login with session
      if (Session.get('auth-google')) {
        const user = this.users.find(({ uid }) => uid === Session.get('auth-google').uid);
        if (user) Session.set('auth', user);
      }
    });
  }

  /**
   * Create user
   * @param {object} user
   */
  async onCreateUser(user = { uid: '' }) {
    if (user.uid.length === 0) return;
    console.log('onCreateUser', user);
    await this.db.ref(`users${REF_PICK}/${user.uid}`).set(user);
  }

  /**
   * Update user
   * @param {User} user
   */
  async onUpdateUser(uid = '', user = {}) {
    if (Object.keys(user).length === 0) return;
    if (uid.length === 0) return;
    console.log('onUpdateUser', user);
    if (Session.get('auth-google')) {
      Session.set('auth', {
        ...Session.get('auth-google'),
        ...user,
      });
    }
    await this.db.ref(`users${REF_PICK}/${uid}`).update(user);
  }
}


export default Users;
