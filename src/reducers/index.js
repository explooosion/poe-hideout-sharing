import { combineReducers } from 'redux';
import hideouts from './hideouts';
import settings from './settings';
import auth from './auth';
import database from './database';
import storage from './storage';
import users from './users';

export default combineReducers({
  hideouts,
  settings,
  auth,
  database,
  storage,
  users,
})
