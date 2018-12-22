import { combineReducers } from 'redux';
import todo from './todo';
import counter from './counter';
import hideouts from './hideouts';

export default combineReducers({
  todo,
  counter,
  hideouts,
})
