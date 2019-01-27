import store from 'store2';
import { firebase, auth } from './config';

class Auth {

  user = {};

  constructor() {
    this.auth = auth;
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.auth.useDeviceLanguage();
    this.onAuthStateChanged();
    if (store.session('auth')) this.user = store.session('auth');
  }

  /**
   * Auth handler
   */
  onAuthStateChanged() {
    this.auth.onAuthStateChanged(user => {
      if (user === null || !user.providerData) return;
      if (user.providerData.length === 0) return;
      this.user = user.providerData[0];
      console.log('onAuthStateChanged', this.user);
      store.session('auth', this.user);
      // console.log('currentUser', this.auth.currentUser);
      // const { displayName, email, photoURL, uid } = user.providerData[0];
      // console.log('Name: ', displayName);
      // console.log('Email: ', email);
      // console.log('Photo URL: ', photoURL);
      // console.log('Provider-specific UID: ', uid);

      // Update user
      // this.UpdateUser({
      //   displayName: String(user.providerData[0].email).split('@')[0],
      // });
    });
  }

  /**
   * Login with google+
   */
  async onSignInByGoogle() {
    return this.auth.signInWithRedirect(this.provider)
      // this.auth.signInWithPopup(this.provider)
      // .then(result => store.session('auth', result))
      .catch(error => console.error('onSignInByGoogle', error));
  }

  /**
   * Logout
   */
  async onLogout() {
    this.auth.signOut()
      .then(() => store.session('auth', null))
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
