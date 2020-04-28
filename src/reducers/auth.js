export const LOGIN_GOOGLE = 'LOGIN_GOOGLE';

const initialState = {
  isLogin: false,
  profile: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_GOOGLE:
      return { ...state, user: action.payload, isLogin: true };
    default:
      return state;
  }
}

