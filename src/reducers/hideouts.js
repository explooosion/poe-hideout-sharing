// import Hideout from '../mock/Hideout';
import Hideout from '../models/Hideout';

const hideouts = (state = Hideout, action) => {
  switch (action.type) {
    case 'SET_Hideouts':
      return { ...state, Lists: action.hideouts };
    default:
      return state;
  }
}

export default hideouts;
