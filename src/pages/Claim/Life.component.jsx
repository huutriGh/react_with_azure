import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Grid from '@mui/material/Grid';
import Typography from '@material-ui/core/Typography';
//import vnLocale from 'date-fns/locale/vi';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import validate from 'validate.js';
import { addLife } from './../../redux/claim/claim.actions';
import {
  selectActiveStep,
  selectLife,
} from './../../redux/claim/claim.selector';
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
  poNumber: {
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
  laName: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên người được bảo hiểm',
    },
    length: {
      maximum: 100,
      message: '^Tên người được bảo hiểm không được vượt quá 100 ký tự',
    },
  },
  laIdNumber: {
    presence: { allowEmpty: false, message: '^Vui lòng nhập số CMND/CCCD' },
    length: {
      maximum: 25,
      minimum: 5,
      message: '^Số CMND/CCCD không hợp lệ',
    },
  },
  laBirthday: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn ngày sinh của người được bảo hiểm',
    },
    datetime: {
      dateOnly: false,
      latest: moment.utc().subtract(0, 'years'),
      message: '^Ngày sinh không hợp lệ',
    },
  },
  laAddress: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập địa chỉ người được bảo hiểm',
    },
    length: {
      maximum: 200,
      message: '^Địa chỉ không được vượt quá 200 ký tự',
    },
  },
  laPhone: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập số điện thoại người được bảo hiểm',
    },
    length: {
      maximum: 15,
      message: '^Số điện thoại không hợp lệ',
    },
    format: {
      // Must be numbers followed by a name
      pattern: `^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?(\\d{3})(\\s|\\.)?(\\d{3})$`,
      message: '^Số điện thoại không hợp lệ',
    },
  },
  rqName: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên người yêu cầu',
    },
    length: {
      maximum: 100,
      message: '^Tên người yêu cầu đã vượt quá 100 ký tự',
    },
  },
  rqIdNumber: {
    presence: { allowEmpty: false, message: '^Vui lòng nhập số CMND/CCCD' },
    length: {
      maximum: 25,
      minimum: 5,
      message: '^Số CMND/CCCD không hợp lệ',
    },
  },
  rqBirthday: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn ngày sinh của người yêu cầu',
    },
    datetime: {
      dateOnly: false,
      latest: moment.utc().subtract(18, 'years'),
      message: '^Người yêu cầu phải từ 18 tuổi',
    },
  },
  rqAddress: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập địa chỉ người yêu cầu',
    },
    length: {
      maximum: 200,
      message: '^Địa chỉ không được vượt quá 200 ký tự',
    },
  },
  rqPhone: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập số điện thoại người yêu cầu',
    },
    length: {
      maximum: 15,
      message: '^Số điện thoại không hợp lệ',
    },
    format: {
      // Must be numbers followed by a name
      pattern: `^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?(\\d{3})(\\s|\\.)?(\\d{3})$`,
      message: '^Số điện thoại không hợp lệ',
    },
  },
};

const Life = ({ life, addLife }) => {
  // Initial state
  const [state, setState] = useState({
    values: life,
    touched: {},
    errors: {},
    isValid: false,
  });

  // Validateion
  useEffect(() => {
    const errors = validate(state.values, schema);

    setState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [state.values]);

  //

  const hasError = (field) =>
    state.touched[field] && state.errors[field] ? true : false;

  //
  const handleChange = (event) => {
    event.persist();
    if (event.target.name === 'laName' || event.target.name === 'rqName') {
      event.target.value = event.target.value.toUpperCase();
    }
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
  };
  const handleChangeLaBirthday = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        laBirthday: event,
      },
      touched: {
        ...state.touched,
        laBirthday: true,
      },
    });
  };
  const handleChangeRqBirthday = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        rqBirthday: event,
      },
      touched: {
        ...state.touched,
        rqBirthday: true,
      },
    });
  };
  const handleAddLife = () => {
    addLife(state.values);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component='h6' gutterBottom color='primary'>
            * Người xảy ra sự kiện bảo hiểm
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            name='poNumber'
            label='Số hợp đồng'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.poNumber}
            onChange={handleChange}
            error={hasError('poNumber')}
            helperText={hasError('poNumber') ? state.errors.poNumber[0] : null}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name='laName'
            label='Họ tên'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.laName}
            onChange={handleChange}
            error={hasError('laName')}
            helperText={hasError('laName') ? state.errors.laName[0] : null}
            InputProps={{ style: { textTransform: 'uppercase' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat='dd/MM/yyyy'
              label='Ngày sinh'
              value={state.values.laBirthday}
              onChange={handleChangeLaBirthday}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={hasError('laBirthday')}
                  size='small'
                  variant='outlined'
                  fullWidth
                  helperText={
                    hasError('laBirthday') ? state.errors.laBirthday[0] : null
                  }
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            name='laIdNumber'
            label='Số CMND'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.laIdNumber}
            onChange={handleChange}
            error={hasError('laIdNumber')}
            helperText={
              hasError('laIdNumber') ? state.errors.laIdNumber[0] : null
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name='laAddress'
            label='Địa chỉ liên lạc'
            fullWidth
            variant='outlined'
            color='secondary'
            multiline
            size='small'
            value={state.values.laAddress}
            onChange={handleChange}
            error={hasError('laAddress')}
            helperText={
              hasError('laAddress') ? state.errors.laAddress[0] : null
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name='laPhone'
            label='Điện thoại liên lạc'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.laPhone}
            onChange={handleChange}
            error={hasError('laPhone')}
            helperText={hasError('laPhone') ? state.errors.laPhone[0] : null}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            component='h6'
            color='primary'
            gutterBottom
            style={{ paddingTop: 10 }}
          >
            * Người yêu cầu bồi thường
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name='rqName'
            label='Họ tên'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.rqName}
            onChange={handleChange}
            error={hasError('rqName')}
            helperText={hasError('rqName') ? state.errors.rqName[0] : null}
            InputProps={{ style: { textTransform: 'uppercase' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat='dd/MM/yyyy'
              label='Ngày sinh'
              value={state.values.rqBirthday}
              onChange={handleChangeRqBirthday}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={hasError('rqBirthday')}
                  variant='outlined'
                  size='small'
                  fullWidth
                  helperText={
                    hasError('rqBirthday') ? state.errors.rqBirthday[0] : null
                  }
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        {/**<Grid item xs={12} sm={6}>
          <TextField
            required
            name='rqBirthday'
            label='Năm sinh'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.rqBirthday}
            onChange={handleChange}
            error={hasError('rqBirthday')}
            helperText={
              hasError('rqBirthday') ? state.errors.rqBirthday[0] : null
            }
          />
        </Grid> */}

        <Grid item xs={12} sm={6}>
          <TextField
            required
            name='rqIdNumber'
            label='Số CMND'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.rqIdNumber}
            onChange={handleChange}
            error={hasError('rqIdNumber')}
            helperText={
              hasError('rqIdNumber') ? state.errors.rqIdNumber[0] : null
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name='rqAddress'
            label='Địa chỉ liên lạc'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.rqAddress}
            onChange={handleChange}
            error={hasError('rqAddress')}
            helperText={
              hasError('rqAddress') ? state.errors.rqAddress[0] : null
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name='rqPhone'
            label='Điện thoại liên lạc'
            fullWidth
            variant='outlined'
            color='secondary'
            size='small'
            value={state.values.rqPhone}
            onChange={handleChange}
            error={hasError('rqPhone')}
            helperText={hasError('rqPhone') ? state.errors.rqPhone[0] : null}
          />
        </Grid>
        <SubmitButton isValid={!state.isValid} actionNext={handleAddLife} />
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  life: selectLife,
  activeStep: selectActiveStep,
});

const mapDispatchToProps = (dispatch) => ({
  addLife: (life) => dispatch(addLife(life)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Life);
