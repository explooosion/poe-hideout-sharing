import { combineReducers } from 'redux';
import settings from './settings';
import auth from './auth';
import firebase from './firebase';
// import storage from './storage';

export default combineReducers({
  settings,
  auth,
  firebase,
  // storage, // not use
})
