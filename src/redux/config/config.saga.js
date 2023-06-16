import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from './../../api/phl.api';
import { fetchOfficeSuccess, fetchOfficeFailure } from './config.actions';
import configActionType from './config.type';

export const getOfficeFromAPI = async () => {
  return await api.get('api/Offices');
};

export function* onfetchOffice() {
  try {
    const office = yield call(getOfficeFromAPI);
    yield put(fetchOfficeSuccess(office.data));
  } catch (error) {
    yield put(fetchOfficeFailure(error));
  }
}

export function* onfetchOfficeStart() {
  yield takeLatest(configActionType.FETCH_OFFICE_START, onfetchOffice);
}

export function* configSagas() {
  yield all([call(onfetchOfficeStart)]);
}
