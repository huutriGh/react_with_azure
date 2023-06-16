import ClaimActiontype from './claim.type';

const INITIAL_STATE = {
  activeStep: 0,
  applyFormValid: false,
  applyStatus: undefined,
  isProcessing: false,
  id: 0,
  images: [],
  life: {
    poNumber: '',
    laName: '',
    laIdNumber: '',
    laBirthday: null,
    laAddress: '',
    laPhone: '',
    rqName: '',
    rqIdNumber: '',
    rqBirthday: null,
    rqAddress: '',
    rqPhone: '',
  },
  benifit: {
    criticalIllness: false,
    hospitalIncome: false,
    accidental: false,
    personAcident: false,
    waiverPremium: false,
    otherBenifit: false,
    otherBenifitDes: '',
  },
  event: {
    eventDate: null,
    eventPlace: '',
    eventReason: '',
    eventDiscription: '',
  },
  medical: {
    hospitalizedDateIn: null,
    hospitalizedDateOut: null,
    diagonostic: '',
    hospital: '',
    doctor: '',
    hospitalHealthIns: '',
    autopsy: false,
  },
  payment: {
    paymentMethod: 1,
    accountName: '',
    accountIdcardDate: null,
    accountIdcard: '',
    accountNumber: '',
    accountHholder: '',
    bank: '',
    poNumberAddedFee: '',
    recieveOffice: '',
    recieveOfficeDes: '',
  },

  ortherInsurance: {
    ortherInsurance: false,
    isr1Name: '',
    isr1EffDate: null,
    isr1Amount: 0,
    isr2Name: '',
    isr2EffDate: null,
    isr2Amount: 0,
    isr3Name: '',
    isr3EffDate: null,
    isr3Amount: 0,
    isr4Name: '',
    isr4EffDate: null,
    isr4Amount: 0,
  },
};
const claimReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ClaimActiontype.INITIAL_STATE:
      return {
        ...INITIAL_STATE,
      };
    case ClaimActiontype.SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.payload,
      };
    case ClaimActiontype.SET_APPLYFORM_VALID:
      return {
        ...state,
        applyFormValid: !state.applyFormValid,
      };
    case ClaimActiontype.NEXT_STEP:
      return {
        ...state,
        activeStep: state.activeStep + 1,
      };
    case ClaimActiontype.PREVIOUS_STEP:
      return {
        ...state,
        activeStep: state.activeStep - 1 < 0 ? 0 : state.activeStep - 1,
      };
    case ClaimActiontype.ADD_LIFE:
      return {
        ...state,
        life: action.payload,
      };
    case ClaimActiontype.ADD_EVENT:
      return {
        ...state,
        event: { ...action.payload },
      };
    case ClaimActiontype.ADD_BENIFIT:
      return {
        ...state,
        benifit: action.payload,
      };
    case ClaimActiontype.ADD_MEDICAL:
      return {
        ...state,
        medical: action.payload,
      };
    case ClaimActiontype.ADD_PAYMENT_METHOD:
      return {
        ...state,
        payment: action.payload,
      };
    case ClaimActiontype.ADD_OTHER_INSURANCE:
      return {
        ...state,
        ortherInsurance: action.payload,
      };
    case ClaimActiontype.ADD_IMAGES:
      return {
        ...state,
        images: action.payload,
      };
    case ClaimActiontype.APPLY_FORM_FAILED:
      return {
        ...state,
        applyStatus: state.applyStatus === false ? null : false,
        isProcessing: !state.isProcessing,
      };
    case ClaimActiontype.APPLY_FORM_SUCCESS:
      return {
        ...state,
        applyStatus: true,
        activeStep: state.activeStep + 1,
        isProcessing: !state.isProcessing,
      };

    case ClaimActiontype.APPLY_FORM_PROCESSING:
      return {
        ...state,
        isProcessing: true,
      };

    default:
      return state;
  }
};

export default claimReducer;
