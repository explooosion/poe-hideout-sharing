import { hideoutsRef, usersRef, auth, provider } from '../config/firebase';

import { FETCH_HIDEOUTS, FETCH_USERS } from '../reducers/database';
import { LOGIN_GOOGLE } from '../reducers/auth';

export const setLocal = locale => ({
  type: 'SET_LOCALE',
  locale: locale,
});

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
  auth.signInWithRedirect(provider)
    .then(result => {
      console.log(result);
      dispatch({
        type: LOGIN_GOOGLE,
        payload: result,
      })
    })
    .catch(error => console.error('onSignInByGoogle', error));
}
