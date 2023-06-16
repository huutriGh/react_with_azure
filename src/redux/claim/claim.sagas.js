import { all, call, delay, put, takeLatest } from 'redux-saga/effects';
import api from '../../apis/callApiWithAruzeAuth';
import {
  applyFormFailed,
  applyFormIsProcessing,
  applyFormSuccess,
  setApplyFormValid,
} from './claim.actions';
import ClaimActiontype from './claim.type';

export const apply = async (applyForm) => {
  return await api.post('/Claim', applyForm);
};
export const createPDF = async (claimInfo) => {
  const config = {
    responseType: 'blob',
  };
  return await api.post('/CreateClaimPDF', claimInfo, config);
};
export const uploadImage = async (images) => {
  try {
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    let formData = new FormData();
    for (let index = 0; index < images.files.length; index++) {
      const file = images.files[index];

      formData.append('request', file);
    }
    formData.append('claimId', images.claimId);

    return await api.post('/UploadImages', formData, config);
  } catch (error) {
    throw error;
  }
};

export function* applyForm({ payload: applyForm }) {
  try {
    yield put(applyFormIsProcessing());
    yield delay(1000);
    console.log(applyForm.info);
    const res = yield call(apply, applyForm.info);
    if (res.status === 200) {
      const [pdf, images] = yield all([
        call(createPDF, res.data),
        call(uploadImage, { claimId: res.data.id, files: applyForm.images }),
      ]);

      console.log('imagesRes: ', images);
      const blob = new Blob([pdf.data], {
        type: 'application/pdf',
      });

      yield put(applyFormSuccess());
      yield put(setApplyFormValid());
      const fileObjectURL = URL.createObjectURL(blob);
      window.open(fileObjectURL);
      sessionStorage.setItem('pdfReport', fileObjectURL);
    }
  } catch (error) {
    yield put(applyFormFailed(error));
  }
}
export function* downloadFile() {
  try {
    const link = document.createElement('a');
    link.href = sessionStorage.getItem('pdfReport');
    link.download = `download-${+new Date()}.pdf`;
    link.click();
  } catch (error) {
    console.log('error', error);
    yield null;
  }
}

export function* onApplyFormStart() {
  yield takeLatest(ClaimActiontype.APPLY_FORM_START, applyForm);
}
export function* onDownloadFile() {
  yield takeLatest(ClaimActiontype.DOWNLOAD_PDF_FILE, downloadFile);
}

export function* claimSagas() {
  yield all([call(onApplyFormStart), call(onDownloadFile)]);
}
