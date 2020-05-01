import { FETCH_HIDEOUTS, FETCH_USERS } from '../actions';

const initialState = {
  hideouts: [],
  users: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HIDEOUTS:
      return { ...state, hideouts: action.payload };
    case FETCH_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
}
