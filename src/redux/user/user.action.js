import userActionType from './user.types';

export const signinStart = (currentUser) => ({
  type: userActionType.EMAIL_SIGN_IN_START,
  payload: currentUser,
});

export const signinSuccess = (currentUser) => ({
  type: userActionType.SIGN_IN_SUCCESS,
  payload: currentUser,
});
export const signinFailure = (errors) => ({
  type: userActionType.SIGN_IN_FAILURE,
  payload: errors,
});
export const signOutStart = () => ({
  type: userActionType.SIGN_OUT_START,
});
export const signOutSuccess = () => ({
  type: userActionType.SIGN_OUT_SUCCESS,
});
export const signOutFailure = (error) => ({
  type: userActionType.SIGN_OUT_SUCCESS,
  payload: error,
});
export const checkSessionStart = () => ({
  type: userActionType.CHECK_SESSION_START,
});
export const checkSessionSuccess = (currentUser) => ({
  type: userActionType.CHECK_SESSION_SUCCESS,
  payload: currentUser,
});
export const checkSessionFailure = (error) => ({
  type: userActionType.CHECK_SESSION_FAILURE,
  payload: error,
});
export const renewStokenStart = () => ({
  type: userActionType.RENEW_TOKEN_START,
});
export const renewStokenSuccess = (currentUser) => ({
  type: userActionType.RENEW_TOKEN_SUCCESS,
  payload: currentUser,
});
export const renewStokenFailure = (error) => ({
  type: userActionType.RENEW_TOKEN_SUCCESS,
  payload: error,
});
