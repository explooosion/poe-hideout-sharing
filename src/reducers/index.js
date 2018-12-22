import { combineReducers } from 'redux';
import todo from './todo';
import counter from './counter';
import hideouts from './hideouts';
import settings from './settings';

export default combineReducers({
  todo,
  counter,
  hideouts,
  settings,
})
