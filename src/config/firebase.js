import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

// Mode
console.info(`[${process.env.NODE_ENV.toUpperCase()} MODE]`);
export const REF_PICK = process.env.NODE_ENV === 'development' ? '_dev' : '';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
}

firebase.initializeApp(config);
firebase.auth().useDeviceLanguage();

export const auth = firebase.auth();

export const storage = firebase.storage();

export const db = firebase.database();
export const hideoutsRef = firebase.database().ref(`hideouts${REF_PICK}`);
export const usersRef = firebase.database().ref(`users${REF_PICK}`);

export const provider = new firebase.auth.GoogleAuthProvider();
