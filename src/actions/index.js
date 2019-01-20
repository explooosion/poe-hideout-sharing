export const setLocal = locale => ({
  type: 'SET_LOCALE',
  locale: locale,
});

export const setHideouts = hideouts => ({
  type: 'SET_Hideouts',
  hideouts: hideouts,
});

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
