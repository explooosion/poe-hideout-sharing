const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREASE_COUNTER':
      return state + action.num;
    case 'DECREASE_COUNTER':
      return state - action.num;
    default:
      return state
  }
}

export default counter
