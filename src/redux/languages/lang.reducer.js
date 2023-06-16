import langType from './lang.types';

const INITIAL_STATE = {
  languages: 'vn',
};

const langReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case langType.CHANGE_LANGUAGE:
      return { ...state, languages: action.payload };

    default:
      return state;
  }
};

export default langReducer;
