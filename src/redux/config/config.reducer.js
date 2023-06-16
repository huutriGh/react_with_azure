import configActionType from './config.type';

const INITIAL_STATE = {
  office: [],
};

const configReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case configActionType.INITIAL_STATE:
      return {
        ...INITIAL_STATE,
      };
    case configActionType.FETCH_OFFICE_SUCCESS:
      return {
        ...state,
        office: action.payload,
      };
    case configActionType.FETCH_OFFICE_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default configReducer;
