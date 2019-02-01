import { combineReducers } from 'redux';
import hideoutType from './hideoutType';
import settings from './settings';
import auth from './auth';
import database from './database';
import storage from './storage';
import users from './users';

export default combineReducers({
  hideoutType,
  settings,
  auth,
  database,
  storage,
  users,
})
