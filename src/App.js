import React, { Component } from 'react';
import './App.scss';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase from 'firebase';

import Header from './components/Header';

import Home from './routes/Home';
import Detail from './routes/Detail';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      db: null,
    };
  }

  componentDidMount() {

    const config = {
      apiKey: 'AIzaSyCE2_Ln7-2_II4flCTrvT5xuS_bYjBQt40',
      authDomain: 'poe-hideout.firebaseapp.com',
      databaseURL: "https://poe-hideout.firebaseio.com/",
    };
    const defaultApp = firebase.initializeApp(config);

    const db = defaultApp.database();
    const starCountRef = db.ref('users');
    starCountRef.on('value', snapshot => {
      console.info('snapshot', snapshot.val());
    });

    this.setState({
      db,
    });

    // this.CreateUser('robby@gmail.com', '123456');
    // this.SignIn('robby@gmail.com', '123456');
    // this.Logout();

    this.Logout();

    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log('auth', firebase.auth().currentUser);
        user.providerData.forEach(profile => {
          console.log('Sign-in provider: ', profile.providerId);
          console.log('Provider-specific UID: ', profile.uid);
          console.log('Name: ', profile.displayName);
          console.log('Email: ', profile.email);
          console.log('Photo URL: ', profile.photoURL);
        });
        // this.UpdateUser({
        //   displayName: String(user.providerData[0].email).split('@')[0],
        // });
      }
    });
  }

  CreateUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(({ code, message }) => {
        console.error(code);
        console.error(message);
      });
  }

  UpdateUser(payload) {
    const user = firebase.auth().currentUser;
    user.updateProfile(payload)
      .then(res => console.log('success', res))
      .catch(error => console.log('update error', error));
  }

  SignInByGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().useDeviceLanguage();

    // firebase.auth().signInWithPopup(provider);
    firebase.auth().signInWithRedirect(provider).then(result => {
      const token = result.credential.accessToken;
      const user = result.user;
      console.log(user, token);
    }).catch(error => {
      console.error(error);
      // var errorCode = error.code;
      // var errorMessage = error.message;
      // // The email of the user's account used.
      // var email = error.email;
      // // The firebase.auth.AuthCredential type that was used.
      // var credential = error.credential;
      // ...
    });
  }

  SignIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(({ code, message }) => {
        console.error(code);
        console.error(message);
      });
  }

  Logout() {
    firebase.auth().signOut().then(() => {
      // console.log('Sign-out successful.');
    }).catch(error => {
      console.error('Sign-out error happened.', error);
    });
  }

  SetData() {
    const { db } = this.state;
    db.ref('users/robby').set({
      username: 'robby',
      email: 'robby@gmail.com',
    });

    // this.db.ref('users/sandy').set({
    //   username: 'sandy',
    //   email: 'sandy@mail.com',
    // });

    // this.db.ref('users/kevin').set({
    //   username: 'kevin',
    //   email: 'kevin@mail.com',
    // });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path="/" component={Home} />
          <Route exact path="/detail/:id" component={Detail} />
        </div>
      </Router>
    );
  }
}

export default App;
