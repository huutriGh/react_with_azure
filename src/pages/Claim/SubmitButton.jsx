import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React from 'react';
import { connect } from 'react-redux';
//import { createStructuredSelector } from 'reselect';
import { nextStep, previousStep } from './../../redux/claim/claim.actions';
//import { selectBenifit } from './../../redux/claim/claim.selector';
import useStyles from './classes.style';

const SubmitButton = ({
  nextStep,
  previousStep,
  isValid,
  actionBack,
  actionNext,
}) => {
  const classes = useStyles();

  const handleNext = () => {
    if (actionNext) {
      actionNext();
    }
    nextStep();
  };
  const handleBack = () => {
    if (actionBack) {
      actionBack();
    }
    previousStep();
  };
  return (
    <Grid item xs={12} className={classes.buttons}>
      <Button onClick={handleBack}>Quay lại</Button>
      <Button variant='contained' onClick={handleNext} disabled={isValid} color='primary'>
        Tiếp tục
      </Button>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
});
export default connect(null, mapDispatchToProps)(SubmitButton);
