import _ from 'lodash';
import i18n from '../i18n';

import { COOKIE_I18N, COOKIE_USER, COOKIE_CREDENTIAL, delCookie, setCookie } from '../utils/Cookie';

import { hideoutsRef, usersRef, auth, provider } from '../config/firebase';

export const FETCH_HIDEOUTS = 'FETCH_HIDEOUTS';
export const FETCH_USERS = 'FETCH_USERS';

export const LOGIN_GOOGLE = 'LOGIN_GOOGLE';
export const LOGOUT_GOOGLE = 'LOGOUT_GOOGLE';

export const SET_LOCALE = 'SET_LOCALE';

export const setLocal = payload => dispatch => {
  i18n.changeLanguage(payload);
  setCookie(COOKIE_I18N, payload);
  dispatch({
    type: SET_LOCALE,
    payload,
  });
};

export const fetchHideouts = () => async dispatch => {
  const SORTKEY = 'timestamp';
  hideoutsRef.on('value', snapshot => {
    const datas = snapshot.val();
    const payload = Object.keys(datas)
      .map(key => datas[key])
      .sort((a, b) => (a[SORTKEY] < b[SORTKEY]) ? 1 : ((b[SORTKEY] < a[SORTKEY]) ? -1 : 0));

    dispatch({
      type: FETCH_HIDEOUTS,
      payload,
    });
  });
};

export const fetchUsers = () => async dispatch => {
  usersRef.on('value', snapshot => {
    const datas = snapshot.val() || [];
    const payload = Object.keys(datas).map(key => datas[key]);

    dispatch({
      type: FETCH_USERS,
      payload,
    });
  });
};

export const loginUser = () => async dispatch => {
  auth.signInWithPopup(provider)
    .then(result => {
      const credential = _.pick(result.credential, ['idToken', 'accessToken', 'providerId']);
      const user = { ...result.user.providerData[0] };

      setCookie(COOKIE_CREDENTIAL, credential);
      setCookie(COOKIE_USER, user);

      dispatch({
        type: LOGIN_GOOGLE,
        payload: { credential, user },
      });
    })
    .catch(error => {
      console.log('loginUser', error);
      delCookie(COOKIE_CREDENTIAL);
      delCookie(COOKIE_USER);
    });
}

export const logoutUser = () => async dispatch => {
  auth.signOut()
    .then(() => {
      delCookie(COOKIE_CREDENTIAL);
      delCookie(COOKIE_USER);

      dispatch({
        type: LOGOUT_GOOGLE,
      });
    })
    .catch(error => console.log('logoutUser', error));
}
