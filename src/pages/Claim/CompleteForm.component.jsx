import Button from '@material-ui/core/Button';
import Grid from '@mui/material/Grid';

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  applyFormStart,
  nextStep,
  previousStep,
  // setApplyFormValid,
} from './../../redux/claim/claim.actions';
import { selectClaimForm } from './../../redux/claim/claim.selector';
import useStyles from './classes.style';

const CompleteForm = ({
  nextStep,
  previousStep,
  applyForm,
  claimInfo,
  formType,
  changeApplyFormStatsus,
}) => {
  const handleNext = () => {
    
    applyForm({
      info: {
        ...claimInfo.life,
        ...claimInfo.benifit,
        ...claimInfo.event,
        ...claimInfo.medical,
        ...claimInfo.payment,
        ...claimInfo.ortherInsurance,
        formType,
      },
      images: claimInfo.images,
    });
    // changeApplyFormStatsus();
  };
  const handleBack = () => {
    previousStep();
  };
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.buttonPrint}>
        <Button onClick={handleBack}>Quay lại</Button>
        <Button variant='contained' color='primary' onClick={handleNext}>
          Tạo file yêu cầu
        </Button>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = createStructuredSelector({
  claimInfo: selectClaimForm,
});

const mapDispatchToProps = (dispatch) => ({
  applyForm: (claimInfo) => dispatch(applyFormStart(claimInfo)),
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
  // changeApplyFormStatsus: () => dispatch(setApplyFormValid()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompleteForm);
