import { combineReducers } from 'redux';
import hideouts from './hideouts';
import settings from './settings';
import firebase from './firebase';

export default combineReducers({
  hideouts,
  settings,
  firebase,
})
