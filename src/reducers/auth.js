import { LOGIN_GOOGLE, LOGOUT_GOOGLE } from '../actions';

const initialState = {
  isLogin: false,
  user: {
    uid: null,
    displayName: null,
    photoURL: null,
    email: null,
    phoneNumber: null,
    providerId: null,
  },
  credential: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_GOOGLE:
      return { ...state, ...action.payload, isLogin: true };
    case LOGOUT_GOOGLE:
      return { ...initialState };
    default:
      return state;
  }
}

