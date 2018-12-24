import { combineReducers } from 'redux';
import hideouts from './hideouts';
import settings from './settings';

export default combineReducers({
  hideouts,
  settings,
})
