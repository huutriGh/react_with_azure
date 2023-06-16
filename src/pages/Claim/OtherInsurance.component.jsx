import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import validate from 'validate.js';
import NumberFormatCustom from './../../components/NumberFormatCustom/NumberFormatCustom.component';
import {
  addOtherInsurance,
  nextStep,
  previousStep,
} from './../../redux/claim/claim.actions';
import { selectOrtherInsurance } from './../../redux/claim/claim.selector';
import SubmitButton from './SubmitButton';
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function (value, options) {
    return +moment.utc(value);
  },
  // Input is a unix timestamp
  format: function (value, options) {
    var format = options.dateOnly ? 'DD/MM/YYYY' : 'DD/MM/YYYY hh:mm:ss';
    return moment.utc(value).format(format);
  },
});

const schema = {
  isr1EffDate: {
    datetime: {
      dateOnly: false,
      latest: moment.utc().subtract(0, 'years'),
      message: '^Ngày hiệu lực không hợp lệ',
    },
  },
  isr2EffDate: {
    datetime: {
      dateOnly: false,
      latest: moment.utc().subtract(0, 'years'),
      message: '^Ngày hiệu lực không hợp lệ',
    },
  },
  isr3EffDate: {
    datetime: {
      dateOnly: false,
      latest: moment.utc().subtract(0, 'years'),
      message: '^Ngày hiệu lực không hợp lệ',
    },
  },
  isr4EffDate: {
    datetime: {
      dateOnly: false,
      latest: moment.utc().subtract(0, 'years'),
      message: '^Ngày hiệu lực không hợp lệ',
    },
  },
};
const OtherInsurance = ({ otherIns, addOtherIns, nextStep, previousStep }) => {
  const [state, setState] = useState({
    values: otherIns,
    touched: {},
    errors: {},
    isValid: false,
  });
  // Validateion
  useEffect(() => {
    let errors = validate(state.values, schema);

    setState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [state.values]);
  const handleChangeIsr1EffDate = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        isr1EffDate:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        isr1EffDate: true,
      },
    });
  };
  const handleChangeIsr2EffDate = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        isr2EffDate:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        isr2EffDate: true,
      },
    });
  };
  const handleChangeIsr3EffDate = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        isr3EffDate:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        isr3EffDate: true,
      },
    });
  };
  const handleChangeIsr4EffDate = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        isr4EffDate:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        isr4EffDate: true,
      },
    });
  };
  const handleChange = (event) => {
    // event.persist();

    if (
      event.target.name === 'ortherInsurance' &&
      event.target.checked === false
    ) {
      setState((state) => ({
        ...state,
        values: {
          ...state.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value,
          isr1Name: 0,
          isr1EffDate: null,
          isr1Amount: 0,
          isr2Name: 0,
          isr2EffDate: null,
          isr2Amount: 0,
          isr3Name: 0,
          isr3EffDate: null,
          isr3Amount: 0,
          isr4Name: 0,
          isr4EffDate: null,
          isr4Amount: 0,
        },
        touched: {
          ...state.touched,
          [event.target.name]: true,
          isr1EffDate: false,
          isr2EffDate: false,
          isr3EffDate: false,
          isr4EffDate: false,
        },
      }));
    } else {
      setState((state) => ({
        ...state,
        values: {
          ...state.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value,
        },
        touched: {
          ...state.touched,
          [event.target.name]: true,
        },
      }));
    }
  };

  const handleAction = () => {
    addOtherIns(state.values);
  };

  const hasError = (field) =>
    state.touched[field] && state.errors[field] ? true : false;
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.values.ortherInsurance}
                onChange={handleChange}
                name='ortherInsurance'
              />
            }
            label='Người xảy ra sự kiện bảo hiểm có được bảo hiểm bởi công ty khác'
          />
        </Grid>

        {state.values.ortherInsurance ? (
          <React.Fragment>
            <Grid item xs={12} sm={6}>
              <TextField
                //required
                name='isr1Name'
                label='Tên Công ty 1'
                fullWidth
                autoComplete='given-name'
                variant='outlined'
                color='secondary'
                size='small'
                value={state.values.isr1Name}
                onChange={handleChange}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                //required
                name='isr1Amount'
                label='Số tiền bảo hiểm'
                fullWidth
                autoComplete='family-name'
                variant='outlined'
                color='secondary'
                size='small'
                value={state.values.isr1Amount}
                onChange={handleChange}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                inputProps={{
                  prefix: 'VND ',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  inputFormat='dd/MM/yyyy'
                  label='Ngày hiệu lực'
                  value={state.values.isr1EffDate}
                  onChange={handleChangeIsr1EffDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant='outlined'
                      size='small'
                      helperText={
                        hasError('isr1EffDate')
                          ? state.errors.isr1EffDate[0]
                          : null
                      }
                      error={hasError('isr1EffDate')}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                //required
                name='isr2Name'
                label='Tên Công ty 2'
                fullWidth
                variant='outlined'
                color='secondary'
                size='small'
                value={state.values.isr2Name}
                onChange={handleChange}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                //required
                name='isr2Amount'
                label='Số tiền bảo hiểm'
                fullWidth
                variant='outlined'
                color='secondary'
                size='small'
                value={state.values.isr2Amount}
                onChange={handleChange}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                inputProps={{
                  prefix: 'VND ',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  inputFormat='dd/MM/yyyy'
                  disableFuture
                  label='Ngày hiệu lực'
                  value={state.values.isr2EffDate}
                  onChange={handleChangeIsr2EffDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      size='small'
                      variant='outlined'
                      error={hasError('isr2EffDate')}
                      helperText={
                        hasError('isr2EffDate')
                          ? state.errors.isr2EffDate[0]
                          : null
                      }
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {state.values.isr2Name !== '' ? (
              <React.Fragment>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //required
                    name='isr3Name'
                    label='Tên Công ty 3'
                    fullWidth
                    variant='outlined'
                    color='secondary'
                    size='small'
                    value={state.values.isr3Name}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    //required
                    name='isr3Amount'
                    label='Số tiền bảo hiểm'
                    fullWidth
                    variant='outlined'
                    color='secondary'
                    size='small'
                    value={state.values.isr3Amount}
                    onChange={handleChange}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    inputProps={{
                      prefix: 'VND ',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      disableFuture
                      label='Ngày hiệu lực'
                      value={state.values.isr3EffDate}
                      onChange={handleChangeIsr3EffDate}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant='outlined'
                          size='small'
                          error={hasError('isr3EffDate')}
                          helperText={
                            hasError('isr3EffDate')
                              ? state.errors.isr3EffDate[0]
                              : null
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </React.Fragment>
            ) : null}

            {state.values.isr3Name !== '' ? (
              <React.Fragment>
                <Grid item xs={12} sm={6}>
                  <TextField
                    //required
                    name='isr4Name'
                    label='Tên Công ty 4'
                    fullWidth
                    variant='outlined'
                    color='secondary'
                    size='small'
                    value={state.values.isr4Name}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    //required
                    name='isr4Amount'
                    label='Số tiền bảo hiểm'
                    fullWidth
                    variant='outlined'
                    color='secondary'
                    size='small'
                    value={state.values.isr4Amount}
                    onChange={handleChange}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    inputProps={{
                      prefix: 'VND ',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      disableFuture
                      label='Ngày hiệu lực'
                      value={state.values.isr4EffDate}
                      onChange={handleChangeIsr4EffDate}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={hasError('isr4EffDate')}
                          fullWidth
                          variant='outlined'
                          size='small'
                          helperText={
                            hasError('isr3EffDate')
                              ? state.errors.isr4EffDate[0]
                              : null
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}

        <SubmitButton
          isValid={!state.isValid}
          actionBack={handleAction}
          actionNext={handleAction}
        />
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  otherIns: selectOrtherInsurance,
});

const mapDispatchToProps = (dispatch) => ({
  addOtherIns: (otherIns) => dispatch(addOtherInsurance(otherIns)),

  nextStep: () => dispatch(nextStep()),
  previousStep: () => dispatch(previousStep()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherInsurance);
