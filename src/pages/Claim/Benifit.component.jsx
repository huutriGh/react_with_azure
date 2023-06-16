import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import validate from 'validate.js';
import { addBenifit } from './../../redux/claim/claim.actions';
import { selectBenifit } from './../../redux/claim/claim.selector';
import SubmitButton from './SubmitButton';

const schema = {
  otherBenifitDes: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập quyền lợi khác',
    },
    length: {
      maximum: 25,
      message: '^Quyền lợi không được vượt quá 25 ký tự',
    },
  },
};

const Benifit = ({ benifit, addBenifit }) => {
  const [state, setState] = useState({
    values: benifit,
    touched: {},
    errors: {},
    isValid: false,
  });
  // Validateion
  useEffect(() => {
    let errors = validate(state.values, schema);

    // criticalIllness: {},
    // accidental: {},
    // hospitalIncome: {},
    // personAcident: {},
    // waiverPremium: {},
    // otherBenifit: {},
    if (
      !(
        state.values.criticalIllness === false &&
        state.values.accidental === false &&
        state.values.hospitalIncome === false &&
        state.values.personAcident === false &&
        state.values.otherBenifit === false &&
        state.values.waiverPremium === false
      )
    ) {
      if (!(state.values.otherBenifit && state.values.otherBenifitDes === '')) {
        errors = null;
      }
    }

    setState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [state.values]);

  const hasError = (field) => {
    return state.touched[field] && state.errors[field] ? true : false;
  };
  const handleChange = (event) => {
    event.persist();

    setState((state) => ({
      ...state,
      values: state.values.otherBenifit
        ? {
            ...state.values,
            [event.target.name]:
              event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value,
          }
        : {
            ...state.values,
            [event.target.name]:
              event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value,
            otherBenifitDes: '',
          },
      touched: state.values.otherBenifit
        ? {
            ...state.touched,
            [event.target.name]: true,
          }
        : {
            ...state.touched,
            [event.target.name]: true,
            otherBenifitDes: false,
          },
    }));
  };

  const handleNext = () => {
    let benifit = state.values;
    if (!benifit.otherBenifit) {
      benifit.otherBenifitDes = '';
    }
    addBenifit(benifit);
    // nextStep();
  };
  const handleBack = () => {
    addBenifit(state.values);
    //  previousStep();
  };
  return (
    <React.Fragment>
      <Grid item xs={12}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.values.criticalIllness}
                onChange={handleChange}
                name='criticalIllness'
              />
            }
            label='Quyền lợi bệnh hiểm nghèo'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.values.personAcident}
                onChange={handleChange}
                name='personAcident'
              />
            }
            label='Quyền lợi thương tật toàn bộ và vĩnh viễn'
          />
          <FormControlLabel
            color='secondary'
            control={
              <Checkbox
                checked={state.values.hospitalIncome}
                onChange={handleChange}
                name='hospitalIncome'
              />
            }
            label='Quyền lợi hỗ trợ chi phí nằm viện'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.values.waiverPremium}
                onChange={handleChange}
                name='waiverPremium'
              />
            }
            label='Quyền lợi từ bỏ thu phí'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.values.accidental}
                onChange={handleChange}
                name='accidental'
              />
            }
            label='Quyền lợi tai nạn'
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.values.otherBenifit}
                onChange={handleChange}
                name='otherBenifit'
              />
            }
            label='Quyền lợi khác '
          />
        </FormGroup>
        {state.values.otherBenifit ? (
          <Grid item xs={12} style={{ marginBottom: '20px' }}>
            <TextField
              required
              name='otherBenifitDes'
              label='Ghi rõ quyền lợi khác'
              fullWidth
              variant='outlined'
              color='secondary'
              size='small'
              value={state.values.otherBenifitDes}
              onChange={handleChange}
              error={hasError('otherBenifitDes')}
              helperText={
                hasError('otherBenifitDes')
                  ? state.errors.otherBenifitDes[0]
                  : null
              }
            />
          </Grid>
        ) : null}
      </Grid>
      <SubmitButton
        isValid={!state.isValid}
        actionNext={handleNext}
        actionBack={handleBack}
      />
    </React.Fragment>
  );
};
const mapStateToProps = createStructuredSelector({
  benifit: selectBenifit,
});

const mapDispatchToProps = (dispatch) => ({
  addBenifit: (life) => dispatch(addBenifit(life)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Benifit);
