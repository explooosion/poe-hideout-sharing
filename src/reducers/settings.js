import { SET_LOCALE } from '../actions';

import { COOKIE_I18N, getCookie } from '../utils/Cookie';

const initialState = {
  locale: getCookie(COOKIE_I18N) || 'US',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return { ...state, locale: action.payload };
    default:
      return state;
  }
}

