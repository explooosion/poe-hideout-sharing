import { combineReducers } from 'redux'
import todo from './todo'
import counter from './counter'

export default combineReducers({
  todo,
  counter,
})
