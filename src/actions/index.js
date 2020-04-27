import { hideoutsRef, usersRef } from '../config/firebase';

import { FETCH_HIDEOUTS, FETCH_USERS } from '../reducers/database';

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

// DEMO ===========================
// let nextTodoId = 0
// export const addTodo = text => ({
//   type: 'ADD_TODO',
//   id: nextTodoId++,
//   text,
// })

// export const toggleTodo = id => ({
//   type: 'TOGGLE_TODO',
//   id,
// })
// DEMO ===========================
