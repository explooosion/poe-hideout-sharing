import { combineReducers } from 'redux';
import hideoutAPI from './hideoutAPI';
import settings from './settings';
import auth from './auth';
import database from './database';
import storage from './storage';
import users from './users';

export default combineReducers({
  hideoutAPI,
  settings,
  auth,
  database,
  storage,
  users,
})
