import { combineReducers } from 'redux';
import settings from './settings';
import auth from './auth';
import firebase from './firebase';

export default combineReducers({
  settings,
  auth,
  firebase,
})
