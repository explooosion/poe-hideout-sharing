import { Hideout } from '../mock/Hideout';

const hideouts = (state = Hideout, action) => {
  switch (action.type) {
    case 'GET_HIDEOUTS':
      return state.Lists;
    case 'GET_HIDEOUT_TYPE':
      return state.Type;
    default:
      return state;
  }
}

export default hideouts;
