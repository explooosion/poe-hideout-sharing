let nextTodoId = 0

export const setLocal = locale => ({
  type: 'SET_LOCALE',
  locale: locale,
});

export const getHideouts = args => ({
  type: 'GET_HIDEOUTS',
  args: args,
});

export const increaseCounter = num => ({
  type: 'INCREASE_COUNTER',
  num: num,
})

export const increaseCounterAsync = num => {
  return dispatch => {
    setTimeout(() => {
      dispatch(increaseCounter(num));
    }, 1000);
  };
}

// DEMO ===========================
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text,
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id,
})
// DEMO ===========================
