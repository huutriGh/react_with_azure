import { all, call } from 'redux-saga/effects';
import { claimSagas } from 'redux/claim/claim.sagas';
export default function* rootSaga() {
  yield all([call(claimSagas)]);
}
