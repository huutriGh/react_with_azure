import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import validate from 'validate.js';
import { fetchOfficeStart } from '../../redux/config/config.actions';
import { selectOffice } from '../../redux/config/config.selector';
import { addPaymentMethod } from './../../redux/claim/claim.actions';
import { selectPayment } from './../../redux/claim/claim.selector';
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

// validation schema
const schema = {
  paymentMethod: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn phương thức thanh toán',
    },
  },
  accountIdcardDate: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn ngày cấp CMND',
    },
    datetime: {
      dateOnly: false,
      // latest: moment.utc().subtract(15, 'years'),
      // message: '^Người yêu cầu phải từ 15 tuổi',
    },
  },
  accountName: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên người nhận tiền',
    },
    length: {
      maximum: 100,
      message: '^Tên người nhận tiền không được vượt quá 100 ký tự',
    },
  },
  accountIdcard: {
    presence: { allowEmpty: false, message: '^Vui lòng nhập số CMND/CCCD' },
    length: {
      maximum: 25,
      minimum: 5,
      message: '^Số CMND/CCCD không hợp lệ',
    },
  },
  bank: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên và chi nhánh ngân hàng',
    },
    length: {
      maximum: 100,
      message: '^Tên và chi nhánh ngân hàng không được vượt quá 100 ký tự',
    },
  },
  recieveOffice: {
    presence: {
      allowEmpty: true,
      message: '^Văn phòng nhận tiền',
    },
    length: {
      maximum: 50,
      message: '^Văn phòng nhận tiền không được vượt quá 50 ký tự',
    },
  },
  accountHholder: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên chủ tài khoản',
    },
    length: {
      maximum: 100,
      message: '^Tên chủ tài khoản không được vượt quá 100 ký tự',
    },
  },
  accountNumber: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập số tài khoản',
    },
    length: {
      maximum: 25,
      message: '^Số tài khoản không được vượt quá 25 ký tự',
    },
  },
  poNumberAddedFee: {
    presence: { allowEmpty: false, message: '^Vui lòng nhập số hợp đồng' },
    length: {
      maximum: 8,
      minimum: 8,
      message: '^Số hợp đồng có 8 chữ số',
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 79999999,
      message: '^Số hợp đồng có 8 chữ số',
    },
  },
};
const schemaMethod4 = {
  paymentMethod: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn phương thức thanh toán',
    },
  },
  accountIdcardDate: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn ngày cấp CMND',
    },
    datetime: {
      dateOnly: false,
      // latest: moment.utc().subtract(15, 'years'),
      // message: '^Người nhận tiền phải từ 15 tuổi',
    },
  },
  accountIdcard: {
    presence: { allowEmpty: false, message: '^Vui lòng nhập số CMND/CCCD' },
    length: {
      maximum: 25,
      minimum: 5,
      message: '^Số CMND/CCCD không hợp lệ',
    },
  },
  accountName: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên người nhận tiền',
    },
    length: {
      maximum: 100,
      message: '^Tên người nhận tiền không được vượt quá 100 ký tự',
    },
  },

  bank: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên và chi nhánh ngân hàng',
    },
    length: {
      maximum: 100,
      message: '^Tên và chi nhánh ngân hàng không được vượt quá 100 ký tự',
    },
  },
  accountHholder: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập tên chủ tài khoản',
    },
    length: {
      maximum: 100,
      message: '^Tên chủ tài khoản không được vượt quá 100 ký tự',
    },
  },
  accountNumber: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập số tài khoản',
    },
    length: {
      maximum: 25,
      message: '^Số tài khoản không được vượt quá 25 ký tự',
    },
  },
};

const PaymentMethod = ({
  addPaymentMethod,
  nextStep,
  previousStep,
  payment,
  fetchOffice,
  office,
}) => {
  const [state, setState] = useState({
    values: payment,
    touched: {},
    errors: {},
    isValid: false,
  });
  useEffect(() => {
    fetchOffice();
  }, [fetchOffice]);

  const handleChange = (event) => {
    event.persist();

    setState((state) => ({
      ...state,
      values:
        state.values.paymentMethod === '2'
          ? {
              ...state.values,
              [event.target.name]:
                event.target.type === 'checkbox'
                  ? event.target.checked
                  : event.target.value,
              accountHholder: '',
              accountIdcard: '',
              accountIdcardDate: null,
              accountName: '',
              accountNumber: '',
              bank: '',
              recieveOffice: '',
              recieveOfficeDes: '',
            }
          : state.values.paymentMethod === '1'
          ? {
              ...state.values,
              [event.target.name]:
                event.target.type === 'checkbox'
                  ? event.target.checked
                  : event.target.value,
              accountHholder: '',
              accountNumber: '',
              bank: '',
              poNumberAddedFee: '',
            }
          : {
              ...state.values,
              [event.target.name]:
                event.target.type === 'checkbox'
                  ? event.target.checked
                  : event.target.value,
              poNumberAddedFee: '',
              recieveOffice: '',
              recieveOfficeDes: '',
            },
      touched:
        state.values.paymentMethod === '2'
          ? {
              ...state.touched,
              [event.target.name]: true,
              accountHholder: false,
              accountIdcard: false,
              accountIdcardDate: null,
              accountName: false,
              accountNumber: false,
              bank: false,
            }
          : state.values.paymentMethod === '1'
          ? {
              ...state.touched,
              [event.target.name]: true,

              accountHholder: false,
              accountNumber: false,
              bank: false,
            }
          : {
              ...state.touched,
              [event.target.name]: true,
            },
    }));
  };
  // Validateion
  useEffect(() => {
    let errors = validate(
      state.values,
      state.values.paymentMethod === '4'
        ? schemaMethod4
        : state.values.paymentMethod === '2'
        ? schema
        : { ...schema, poNumberAddedFee: {} }
    );

    if (
      state.values.paymentMethod === '2' &&
      state.values.poNumberAddedFee !== '' &&
      state.values.poNumberAddedFee.length === 8
    ) {
      errors = null;
    }
    if (state.values.paymentMethod === '1') {
      if (
        errors.hasOwnProperty('accountName') === false &&
        errors.hasOwnProperty('accountIdcardDate') === false &&
        errors.hasOwnProperty('accountIdcard') === false
      ) {
        errors = null;
      }
    }

    setState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [state.values]);

  //
  const hasError = (field) =>
    state.touched[field] && state.errors[field] ? true : false;
  const handleChangeCccountIdcardDate = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        accountIdcardDate:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        accountIdcardDate: true,
      },
    });
  };
  const addPayment = () => {
    const recieveOfficeDes = office.find(
      (e) => e.Code === state.values.recieveOffice
    );
    addPaymentMethod({
      ...state.values,
      recieveOfficeDes: recieveOfficeDes ? recieveOfficeDes.Name : '',
    });
  };
  const handleAction = () => {
    addPayment();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl component='fieldset'>
          <FormControlLabel
            control={
              <Radio
                checked={state.values.paymentMethod === '1'}
                onChange={handleChange}
                value='1'
                name='paymentMethod'
                inputProps={{ 'aria-label': '1' }}
                error={
                  hasError('paymentMethod')
                    ? hasError('paymentMethod')
                    : undefined
                }
                helpertext={
                  hasError('paymentMethod')
                    ? state.errors.paymentMethod[0]
                    : null
                }
              />
            }
            label='Nhận tiền mặt tại TTDV khách hàng của Công ty (chỉ áp dụng cho số tiền dưới 20 triệu)'
          />
          <FormControlLabel
            control={
              <Radio
                checked={state.values.paymentMethod === '2'}
                onChange={handleChange}
                value='2'
                name='paymentMethod'
                inputProps={{ 'aria-label': '2' }}
                error={
                  hasError('paymentMethod')
                    ? hasError('paymentMethod')
                    : undefined
                }
                helpertext={
                  hasError('paymentMethod')
                    ? state.errors.paymentMethod[0]
                    : null
                }
              />
            }
            label='Đóng phí bảo hiểm'
          />
          <FormControlLabel
            control={
              <Radio
                checked={state.values.paymentMethod === '3'}
                onChange={handleChange}
                name='paymentMethod'
                value='3'
                inputProps={{ 'aria-label': '3' }}
                error={
                  hasError('paymentMethod')
                    ? hasError('paymentMethod')
                    : undefined
                }
                helpertext={
                  hasError('paymentMethod')
                    ? state.errors.paymentMethod[0]
                    : null
                }
              />
            }
            label='Chuyển vào tài khoản cá nhân'
          />
          <FormControlLabel
            control={
              <Radio
                checked={state.values.paymentMethod === '4'}
                value='4'
                onChange={handleChange}
                name='paymentMethod'
                inputProps={{ 'aria-label': '4' }}
                error={
                  hasError('paymentMethod')
                    ? hasError('paymentMethod')
                    : undefined
                }
                helpertext={
                  hasError('paymentMethod')
                    ? state.errors.paymentMethod[0]
                    : null
                }
              />
            }
            label='Nhận tiền mặt tại ngân hàng'
          />
        </FormControl>
      </Grid>
      {state.values.paymentMethod === '2' ? (
        <Grid item xs={12}>
          <TextField
            required
            name='poNumberAddedFee'
            label='Số hợp đồng được đóng phí'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.poNumberAddedFee}
            onChange={handleChange}
            error={hasError('poNumberAddedFee')}
            helperText={
              hasError('poNumberAddedFee')
                ? state.errors.poNumberAddedFee[0]
                : null
            }
          />
        </Grid>
      ) : null}
      {state.values.paymentMethod === '1' ||
      state.values.paymentMethod === '3' ||
      state.values.paymentMethod === '4' ? (
        <React.Fragment>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name='accountName'
              label='Tên người nhận tiền'
              fullWidth
              autoComplete='given-name'
              variant='outlined'
              color='secondary'
              size='small'
              value={state.values.accountName}
              onChange={handleChange}
              error={hasError('accountName')}
              helperText={
                hasError('accountName') ? state.errors.accountName[0] : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              required
              name='accountIdcard'
              label='Số CMND'
              fullWidth
              variant='outlined'
              color='secondary'
              size='small'
              value={state.values.accountIdcard}
              onChange={handleChange}
              error={hasError('accountIdcard')}
              helperText={
                hasError('accountIdcard') ? state.errors.accountIdcard[0] : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat='dd/MM/yyyy'
                label='Ngày hiệu lực'
                value={state.values.accountIdcardDate}
                onChange={handleChangeCccountIdcardDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant='outlined'
                    size='small'
                    error={hasError('accountIdcardDate')}
                    helperText={
                      hasError('accountIdcardDate')
                        ? state.errors.accountIdcardDate[0]
                        : null
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          {state.values.paymentMethod === '1' ? (
            <Grid item xs={12} sm={12}>
              <FormControl variant='outlined' fullWidth size='small'>
                <InputLabel id='recieveOffice-select-outlined-label'>
                  Văn phòng nhận tiền
                </InputLabel>
                <Select
                  labelId='recieveOffice-select-outlined-label'
                  id='recieveOffice-select-outlined'
                  value={state.values.recieveOffice}
                  onChange={handleChange}
                  label='Văn phòng nhận tiền'
                  name='recieveOffice'
                >
                  <MenuItem value=''>(Trống)</MenuItem>
                  {office.map((off) => (
                    <MenuItem key={off.Code} value={off.Code}>
                      {off.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : null}
        </React.Fragment>
      ) : null}

      {state.values.paymentMethod === '3' ||
      state.values.paymentMethod === '4' ? (
        <Grid item xs={12}>
          <TextField
            required
            name='bank'
            label='Tên và chi nhánh ngân hàng'
            fullWidth
            autoComplete='family-name'
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.bank}
            onChange={handleChange}
            error={hasError('bank')}
            helperText={hasError('bank') ? state.errors.bank[0] : null}
          />
        </Grid>
      ) : null}
      {state.values.paymentMethod === '3' ? (
        <React.Fragment>
          <Grid item xs={12} sm={6}>
            <TextField
              required={!(state.values.paymentMethod === '4')}
              name='accountHholder'
              label='Tên chủ tài khoản'
              fullWidth
              variant='outlined'
              color='secondary'
              multiline
              size='small'
              value={state.values.accountHholder}
              onChange={handleChange}
              error={hasError('accountHholder')}
              helperText={
                hasError('accountHholder')
                  ? state.errors.accountHholder[0]
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required={!(state.values.paymentMethod === '4')}
              name='accountNumber'
              label='Số tài khoản'
              fullWidth
              variant='outlined'
              color='secondary'
              size='small'
              value={state.values.accountNumber}
              onChange={handleChange}
              error={hasError('accountNumber')}
              helperText={
                hasError('accountNumber') ? state.errors.accountNumber[0] : null
              }
            />
          </Grid>
        </React.Fragment>
      ) : null}

      <SubmitButton
        isValid={!state.isValid}
        actionBack={handleAction}
        actionNext={handleAction}
      />
    </Grid>
  );
};

const mapStateToProps = createStructuredSelector({
  payment: selectPayment,
  office: selectOffice,
});

const mapDispatchToProps = (dispatch) => ({
  addPaymentMethod: (method) => dispatch(addPaymentMethod(method)),
  fetchOffice: () => dispatch(fetchOfficeStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethod);
