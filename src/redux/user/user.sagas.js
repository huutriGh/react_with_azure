import { all, call, put, takeLatest } from 'redux-saga/effects';
import { signIn, signOut } from './../../azure/authPopup';
import { signinFailure, signinSuccess, signOutSuccess } from './user.action';
import userActionTypes from './user.types';

export function* login() {
  try {
    const res = yield call(signIn);

    yield put(signinSuccess(res));
  } catch (error) {
    yield put(signinFailure(error));
  }
}

export function* logOut() {
  try {
    signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signinFailure(error));
  }
}

export function* onLoginStart() {
  yield takeLatest(userActionTypes.EMAIL_SIGN_IN_START, login);
}
export function* onSignOutStart() {
  yield takeLatest(userActionTypes.SIGN_OUT_START, logOut);
}

export function* userSagas() {
  yield all([]);
}

// import api, { saveTokenToLocalStorage } from 'apis/phl';

// export const loginWithEmail = async (login) => {
//   return await api.post('Auth/Login', login);
// };

// export const getProject = async () => {
//   return await api.get('Projects');
// };
// export function* login({ payload: login }) {
//   try {
//     const res = yield call(loginWithEmail, {
//       email: login.userId,
//       password: login.password,
//     });
//     saveTokenToLocalStorage(res.data.token, res.data.refreshToken);

//     yield put(signinSuccess(res.data));
//   } catch (error) {
//     yield put(signinFailure(error));
//     console.log(error);
//   }
// }
