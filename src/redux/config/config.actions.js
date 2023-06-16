import configActionType from './config.type';

export const initialState = () => ({
  type: configActionType.INITIAL_STATE,
});

export const fetchOfficeStart = () => ({
  type: configActionType.FETCH_OFFICE_START,
});
export const fetchOfficeSuccess = (office) => ({
  type: configActionType.FETCH_OFFICE_SUCCESS,
  payload: office,
});
export const fetchOfficeFailure = (error) => ({
  type: configActionType.FETCH_OFFICE_FAILURE,
  payload: error,
});
