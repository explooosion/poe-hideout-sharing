import firebase from 'firebase';

import HideoutList from '../interface/HideoutList';

class Firebase {

  apiKey = 'AIzaSyCE2_Ln7-2_II4flCTrvT5xuS_bYjBQt40';

  authDomain = 'poe-hideout.firebaseapp.com';

  databaseURL = 'https://poe-hideout.firebaseio.com/';

  constructor() {
    this.defaultApp = firebase.initializeApp(this.config);
    this.db = this.defaultApp.database();

    this.onUsersSnapshot();
    this.onHideoutsSnapshot();
  }

  get config() {
    return {
      apiKey: this.apiKey,
      authDomain: this.authDomain,
      databaseURL: this.databaseURL,
    };
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
  onSetHideouts(hideout) {
    this.db.ref(`hideouts/${hideout.id}`).set(hideout);
  }

}

export default Firebase;
