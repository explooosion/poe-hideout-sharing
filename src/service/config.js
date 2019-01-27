// import firebase from 'firebase';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyCE2_Ln7-2_II4flCTrvT5xuS_bYjBQt40',
  authDomain: 'poe-hideout.firebaseapp.com',
  databaseURL: 'https://poe-hideout.firebaseio.com/',
  projectId: "***",
  storageBucket: 'gs://poe-hideout.appspot.com/',
}

firebase.initializeApp(config);

const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.database();

// Mode
console.info(`[${process.env.NODE_ENV.toUpperCase()} MODE]`);
const REF_PICK = process.env.NODE_ENV === 'development' ? '_dev' : '';

export { firebase, auth, storage, db, REF_PICK };
