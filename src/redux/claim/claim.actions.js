import ClaimActiontype from './claim.type';

export const initialState = () => ({
  type: ClaimActiontype.INITIAL_STATE,
});
export const nextStep = () => ({
  type: ClaimActiontype.NEXT_STEP,
});

export const previousStep = () => ({
  type: ClaimActiontype.PREVIOUS_STEP,
});

export const applyFormStart = (claimInfo) => ({
  type: ClaimActiontype.APPLY_FORM_START,
  payload: claimInfo,
});
export const applyFormIsProcessing = (claimInfo) => ({
  type: ClaimActiontype.APPLY_FORM_PROCESSING,
});
export const applyFormSuccess = () => ({
  type: ClaimActiontype.APPLY_FORM_SUCCESS,
});
export const applyFormFailed = (error) => ({
  type: ClaimActiontype.APPLY_FORM_FAILED,
  payload: error,
});

export const addLife = (life) => ({
  type: ClaimActiontype.ADD_LIFE,
  payload: life,
});
export const addBenifit = (nenifit) => ({
  type: ClaimActiontype.ADD_BENIFIT,
  payload: nenifit,
});
export const addEvent = (event) => ({
  type: ClaimActiontype.ADD_EVENT,
  payload: event,
});
export const addMedical = (medical) => ({
  type: ClaimActiontype.ADD_MEDICAL,
  payload: medical,
});
export const addOtherInsurance = (insurance) => ({
  type: ClaimActiontype.ADD_OTHER_INSURANCE,
  payload: insurance,
});
export const addPaymentMethod = (paymentMethod) => ({
  type: ClaimActiontype.ADD_PAYMENT_METHOD,
  payload: paymentMethod,
});
export const addImages = (images) => ({
  type: ClaimActiontype.ADD_IMAGES,
  payload: images,
});
export const downloadFilePDF = () => ({
  type: ClaimActiontype.DOWNLOAD_PDF_FILE,
});
export const setActiveStep = (step) => ({
  type: ClaimActiontype.SET_ACTIVE_STEP,
  payload: step,
});
export const setApplyFormValid = () => ({
  type: ClaimActiontype.SET_APPLYFORM_VALID,
});
