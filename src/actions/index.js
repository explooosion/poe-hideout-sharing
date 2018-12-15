let nextTodoId = 0

export const increaseCounter = num => ({
  type: 'INCREASE_COUNTER',
  num: num,
})

export const increaseCounterAsync = num => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increaseCounter(1));
    }, 1000);
  };
}

export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text,
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter,
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id,
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
}
