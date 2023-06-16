import { createSelector } from 'reselect';

const selectClaim = (state) => state.claim;

export const selectLife = createSelector([selectClaim], (claim) => claim.life);
export const selectBenifit = createSelector(
  [selectClaim],
  (claim) => claim.benifit
);
export const selectEvent = createSelector(
  [selectClaim],
  (claim) => claim.event
);
export const selectMedical = createSelector(
  [selectClaim],
  (claim) => claim.medical
);
export const selectPayment = createSelector(
  [selectClaim],
  (claim) => claim.payment
);
export const selectOrtherInsurance = createSelector(
  [selectClaim],
  (claim) => claim.ortherInsurance
);
export const selectImages = createSelector(
  [selectClaim],
  (claim) => claim.images
);
export const selectApplyStatus = createSelector(
  [selectClaim],
  (claim) => claim.applyStatus
);
export const selectClaimForm = createSelector([selectClaim], (claim) => claim);
export const selectActiveStep = createSelector(
  [selectClaim],
  (claim) => claim.activeStep
);
export const selectIsProcessing = createSelector(
  [selectClaim],
  (claim) => claim.isProcessing
);
export const selectFormApplyStatus = createSelector(
  [selectClaim],
  (claim) => claim.applyFormValid
);
