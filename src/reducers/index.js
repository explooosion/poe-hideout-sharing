import { combineReducers } from 'redux';
import hideoutAPI from './hideoutAPI';
import settings from './settings';
import auth from './auth';
// import users from './users';
import database from './database';
// import storage from './storage';

export default combineReducers({
  hideoutAPI,
  settings,
  auth,
  database,
  // storage, // not use
  // users,
})
