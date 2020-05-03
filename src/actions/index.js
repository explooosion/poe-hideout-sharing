import _ from 'lodash';
import i18n from '../i18n';

import {
  COOKIE_I18N,
  COOKIE_USER,
  COOKIE_CREDENTIAL,
  delCookie,
  setCookie,
} from '../utils/Cookie';

import {
  db,
  hideoutsRef,
  usersRef,
  auth,
  provider,
  REF_PICK,
} from '../config/firebase';

export const FETCH_HIDEOUTS = 'FETCH_HIDEOUTS';
export const UPDATE_HIDEOUT = 'UPDATE_HIDEOUT';
export const UPDATE_HIDEOUT_VIEWS = 'UPDATE_HIDEOUT_VIEWS';
export const UPDATE_HIDEOUT_FAVORITE = 'UPDATE_HIDEOUT_FAVORITE';
export const UPDATE_HIDEOUT_DOWNLOAD = 'UPDATE_HIDEOUT_DOWNLOAD';
export const CREATE_HIDEOUT = 'CREATE_HIDEOUT';
export const DELETE_HIDEOUT = 'DELETE_HIDEOUT';

export const FETCH_USERS = 'FETCH_USERS';

export const LOGIN_GOOGLE = 'LOGIN_GOOGLE';
export const LOGOUT_GOOGLE = 'LOGOUT_GOOGLE';

export const SET_LOCALE = 'SET_LOCALE';

export const setLocal = payload => dispatch => {
  i18n.changeLanguage(payload);
  setCookie(COOKIE_I18N, payload);
  dispatch({ type: SET_LOCALE, payload });
};

export const fetchHideouts = () => dispatch => {
  const SORTKEY = 'timestamp';
  hideoutsRef.once('value', snapshot => {
    const datas = snapshot.val();
    const payload = Object.keys(datas)
      .map(key => datas[key])
      .sort((a, b) => (a[SORTKEY] < b[SORTKEY]) ? 1 : ((b[SORTKEY] < a[SORTKEY]) ? -1 : 0));

    dispatch({ type: FETCH_HIDEOUTS, payload });
  });
}

export const createHideout = payload => async dispatch => {
  await db.ref(`hideouts${REF_PICK}/${payload.id}`).set(payload);
  dispatch(fetchHideouts());
}

export const updateHideout = payload => async dispatch => {
  await db.ref(`hideouts${REF_PICK}/${payload.id}`).update(payload);
  dispatch(fetchHideouts());
};

export const updateHideoutViews = async payload => {
  await db.ref(`hideouts${REF_PICK}/${payload.id}`)
    .child('views')
    .transaction(views => (views || 0) + 1);
  // TO NOT FETCHHIDEOUTS
};

export const updateHideoutFavorite = payload => async dispatch => {
  await db.ref(`hideouts${REF_PICK}/${payload.id}`)
    .child('favorite')
    .transaction(favorite => (favorite || 0) + 1);
  dispatch(fetchHideouts());
};

export const updateHideoutDownload = payload => async dispatch => {
  await db.ref(`hideouts${REF_PICK}/${payload.id}`)
    .child('download')
    .transaction(download => (download || 0) + 1);
  dispatch(fetchHideouts());
};

export const deleteHideout = payload => async dispatch => {
  await db.ref(`hideouts${REF_PICK}/${payload.id}`).remove();
  dispatch(fetchHideouts());
}

export const fetchUsers = () => dispatch => {
  usersRef.once('value', snapshot => {
    const datas = snapshot.val() || [];
    const payload = Object.keys(datas).map(key => datas[key]);
    dispatch({ type: FETCH_USERS, payload });
  });
};

export const loginUser = () => async dispatch => {
  const result = await auth.signInWithPopup(provider)
    .catch(error => {
      console.log('loginUser', error);
      delCookie(COOKIE_CREDENTIAL);
      delCookie(COOKIE_USER);
    });

  const credential = _.pick(result.credential, ['accessToken', 'providerId']);
  const user = { ...result.user.providerData[0] };
  setCookie(COOKIE_CREDENTIAL, credential);
  setCookie(COOKIE_USER, user);

  const payload = { credential, user };
  dispatch({ type: LOGIN_GOOGLE, payload });

  try {
    if (result.additionalUserInfo.isNewUser) {
      const profile = {
        uid: user.uid,
        uname: user.displayName,
        avatar: user.photoURL,
      }
      await createUser(profile);
      dispatch(fetchUsers());
    }
  } catch (e) { console.error('create user failed'); }
}

export const logoutUser = history => async dispatch => {
  await auth.signOut().catch(error => console.log('logoutUser', error));
  delCookie(COOKIE_CREDENTIAL);
  delCookie(COOKIE_USER);
  dispatch({ type: LOGOUT_GOOGLE });
  history.go('/');
}

export const createUser = async user => {
  await db.ref(`users${REF_PICK}/${user.uid}`).set(user);
}

export const updateUser = user => async dispatch => {
  await db.ref(`users${REF_PICK}/${user.uid}`).update(user);
  dispatch(fetchUsers());
}
