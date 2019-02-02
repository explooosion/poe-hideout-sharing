import { firebase, auth } from './config';
import Session from './Session';
import User from '../interface/User';

class Auth {

  user = null;

  token = '';

  userSession = Session.get('auth');

  constructor() {
    this.auth = auth;
    if (this.userSession) this.user = Session.get('auth');
    // Initial
    this.provider = new firebase.auth.GoogleAuthProvider();
    // Do not use OAuth 2.0 from official
    // this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.auth.useDeviceLanguage();
    // Handler
    this.getRedirectResult();
    this.onAuthStateChanged();
  }

  setAuthData(payload = null) {
    // Payload empty or has user then return
    if (!payload && this.user) return;
    const { uid, displayName, photoURL, email } = payload;
    this.user = new User(uid, displayName, photoURL, email);
    Session.set('auth-google', this.user);
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
   * Auth handler
   */
  onAuthStateChanged() {
    this.auth.onAuthStateChanged(user => {
      if (user === null || !user.providerData) return;
      if (user.providerData.length === 0) return;
      if (user.providerData[0].uid.length === 0) return;
      this.setAuthData(user.providerData[0]);
    });
  }

  /**
   * Login after redirect
   */
  getRedirectResult() {
    this.auth.getRedirectResult().then(result => {
      if (result.credential && result.user) {
        if (result.user.providerData.length === 0) return;
        if (result.user.providerData[0].uid.length === 0) return;
        this.token = result.credential.accessToken;
        this.setAuthData(result.user.providerData[0]);
      }
    });
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
