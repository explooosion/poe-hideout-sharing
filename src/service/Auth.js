import { firebase, auth } from './config';
import Session from './Session';
import User from '../interface/User';

class Auth {

  user = {};

  userSession = Session.get('auth');

  constructor() {
    this.auth = auth;
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.auth.useDeviceLanguage();
    this.onAuthStateChanged();

    if (this.userSession) this.user = Session.get('auth');
  }

  /**
   * Auth handler
   */
  onAuthStateChanged() {
    this.auth.onAuthStateChanged(user => {
      if (user === null || !user.providerData) return;
      if (user.providerData.length === 0) return;
      if (user.providerData[0].uid.length === 0) return;
      const { uid, displayName, photoURL, email } = user.providerData[0];
      this.user = new User(uid, displayName, photoURL, email);
      console.log('onAuthStateChanged', this.user);
      Session.set('auth-google', this.user);
    });
  }

  /**
   * Login with google+
   */
  async onSignInByGoogle() {
    // return this.auth.signInWithPopup(this.provider)
    return this.auth.signInWithRedirect(this.provider)
      .catch(error => console.error('onSignInByGoogle', error));
  }

  /**
   * Logout
   */
  async onLogout() {
    await this.auth.signOut()
      .then(() => {
        Session.set('auth-google', null);
        Session.set('auth', null);
      })
      .catch(error => console.error('onLogout', error));
  }

  // this.CreateUser('robby@gmail.com', '123456');
  // this.SignIn('robby@gmail.com', '123456');

  // CreateUser(email, password) {
  //   firebase.auth().createUserWithEmailAndPassword(email, password)
  //     .catch(({ code, message }) => {
  //       console.error(code);
  //       console.error(message);
  //     });
  // }

  // UpdateUser(payload) {
  //   const user = firebase.auth().currentUser;
  //   user.updateProfile(payload)
  //     .then(res => console.log('success', res))
  //     .catch(error => console.log('update error', error));
  // }

  // SignIn(email, password) {
  //   firebase.auth().signInWithEmailAndPassword(email, password)
  //     .catch(({ code, message }) => {
  //       console.error(code);
  //       console.error(message);
  //     });
  // }
}

export default Auth;
