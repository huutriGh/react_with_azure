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
//import vnLocale from 'date-fns/locale/vi';
import { createStructuredSelector } from 'reselect';
import validate from 'validate.js';
import { addMedical } from './../../redux/claim/claim.actions';
import { selectMedical } from './../../redux/claim/claim.selector';
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

const schemaClm01 = {
  hospitalizedDateIn: {
    datetime: {
      dateOnly: false,
      // latest: moment.utc().subtract(18, 'years'),
      message: '^Ngày vào viện không hợp lệ',
    },
  },
  hospitalizedDateOut: function (
    value,
    attributes,
    attributeName,
    options,
    constraints
  ) {
    return {
      datetime: {
        dateOnly: false,
        earliest: new Date(attributes.hospitalizedDateIn),
        // latest: moment.utc().subtract(18, 'years'),
        message:
          '^Ngày ra viện không hợp lệ. Ngày ra viện phải lớn hơn hoặc bằng ngày nhập viện.',
      },
    };
  },

  diagonostic: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập chẩn đoán khi ra viện',
    },
    length: {
      maximum: 200,
      message: '^Chẩn đoán không được vượt quá 200 ký tự',
    },
  },
  hospital: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập nơi điều trị',
    },
    length: {
      maximum: 100,
      message: '^Nơi điều trị không được vượt quá 100 ký tự',
    },
  },
  doctor: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập tên bác sĩ điều trị',
    },
    length: {
      maximum: 500,
      message: '^Tên bác sĩ điều trị không được vượt quá 100 ký tự',
    },
  },
  hospitalHealthIns: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập nơi ĐK KCB ban đầu',
    },
    length: {
      maximum: 100,
      message: '^Nơi ĐK KCB ban đầu không được vượt quá 100 ký tự',
    },
  },
};
const schemaClm02 = {
  hospitalizedDateIn: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn ngày vào viện',
    },
    datetime: {
      dateOnly: false,
      // latest: moment.utc().subtract(18, 'years'),
      message: '^Ngày vào viện không hợp lệ',
    },
  },
  hospitalizedDateOut: function (
    value,
    attributes,
    attributeName,
    options,
    constraints
  ) {
    return {
      presence: {
        allowEmpty: false,
        message: '^Vui lòng chọn ngày ra viện',
      },
      datetime: {
        dateOnly: false,
        earliest: new Date(attributes.hospitalizedDateIn),
        // latest: moment.utc().subtract(18, 'years'),
        message:
          '^Ngày ra viện không hợp lệ. Ngày ra viện phải lớn hơn hoặc bằng ngày nhập viện.',
      },
    };
  },

  diagonostic: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập chẩn đoán khi ra viện',
    },
    length: {
      maximum: 200,
      message: '^Chẩn đoán không được vượt quá 200 ký tự',
    },
  },
  hospital: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập nơi điều trị',
    },
    length: {
      maximum: 100,
      message: '^Nơi điều trị không được vượt quá 100 ký tự',
    },
  },
  doctor: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập tên bác sĩ điều trị',
    },
    length: {
      maximum: 500,
      message: '^Tên bác sĩ điều trị không được vượt quá 100 ký tự',
    },
  },
  hospitalHealthIns: {
    presence: {
      allowEmpty: true,
      message: '^Vui lòng nhập nơi ĐK KCB ban đầu',
    },
    length: {
      maximum: 100,
      message: '^Nơi ĐK KCB ban đầu không được vượt quá 100 ký tự',
    },
  },
};

const Medical = ({ medical, addMedical, nextStep, previousStep, formType }) => {
  const [state, setState] = useState({
    values: medical,
    touched: {},
    errors: {},
    isValid: false,
  });

  // Validateion
  useEffect(() => {
    const errors = validate(
      state.values,
      formType === 'Clm01' ? schemaClm01 : schemaClm02
    );

    setState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [state.values, formType]);

  //

  const hasError = (field) =>
    state.touched[field] && state.errors[field] ? true : false;

  const handleChange = (event) => {
    setState({
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
    });
  };
  const handleChangeHospitalizedDateIn = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        hospitalizedDateIn:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        hospitalizedDateIn: true,
      },
    });
  };
  const handleChangehospitalizedDateOut = (event) => {
    setState({
      ...state,
      values: {
        ...state.values,
        hospitalizedDateOut:
          event != null && event.toString() !== 'Invalid Date'
            ? moment(event).format('YYYY-MM-DD')
            : null,
      },
      touched: {
        ...state.touched,
        hospitalizedDateOut: true,
      },
    });
  };

  const handleAction = () => {
    addMedical(state.values);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              inputFormat='dd/MM/yyyy'
              label={formType === 'Clm01' ? 'Ngày vào viện' : 'Ngày vào viện*'}
              value={state.values.hospitalizedDateIn}
              onChange={handleChangeHospitalizedDateIn}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={hasError('hospitalizedDateIn')}
                  fullWidth
                  variant='outlined'
                  size='small'
                  helperText={
                    hasError('hospitalizedDateIn')
                      ? state.errors.hospitalizedDateIn[0]
                      : null
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              inputFormat='dd/MM/yyyy'
              label={formType === 'Clm01' ? 'Ngày ra viện' : 'Ngày ra viện*'}
              value={state.values.hospitalizedDateOut}
              onChange={handleChangehospitalizedDateOut}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={hasError('hospitalizedDateOut')}
                  variant='outlined'
                  size='small'
                  fullWidth
                  helperText={
                    hasError('hospitalizedDateOut')
                      ? state.errors.hospitalizedDateOut[0]
                      : null
                  }
                />
              )}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={12}>
          <TextField
            required={!(formType === 'Clm01')}
            name='diagonostic'
            label='Chẩn đoán khi ra viện'
            fullWidth
            autoComplete='family-name'
            color='secondary'
            variant='outlined'
            size='small'
            value={state.values.diagonostic}
            onChange={handleChange}
            error={formType === 'Clm01' ? false : hasError('diagonostic')}
            helperText={
              hasError('diagonostic') ? state.errors.diagonostic[0] : null
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required={!(formType === 'Clm01')}
            name='hospital'
            label='Nơi điều trị'
            fullWidth
            autoComplete='family-name'
            color='secondary'
            variant='outlined'
            size='small'
            value={state.values.hospital}
            onChange={handleChange}
            error={hasError('hospital')}
            helperText={hasError('hospital') ? state.errors.hospital[0] : null}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required={!(formType === 'Clm01')}
            name='doctor'
            label='Tên bác sĩ điều trị'
            fullWidth
            autoComplete='family-name'
            color='secondary'
            multiline
            variant='outlined'
            size='small'
            value={state.values.doctor}
            onChange={handleChange}
            error={hasError('doctor')}
            helperText={hasError('doctor') ? state.errors.doctor[0] : null}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            //required={!(formType === 'Clm01')}
            name='hospitalHealthIns'
            label='Nơi đăng ký KCB ban đầu trên thẻ BHYT'
            fullWidth
            autoComplete='family-name'
            color='secondary'
            multiline
            variant='outlined'
            size='small'
            value={state.values.hospitalHealthIns}
            onChange={handleChange}
            error={hasError('hospitalHealthIns')}
            helperText={
              hasError('hospitalHealthIns')
                ? state.errors.hospitalHealthIns[0]
                : null
            }
          />
        </Grid>

        {formType === 'Clm01' ? (
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.values.autopsy}
                  onChange={handleChange}
                  name='autopsy'
                />
              }
              label='Người tử vong được khám nghiệm/Giải phải tử thi'
            />
          </Grid>
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
  medical: selectMedical,
});

const mapDispatchToProps = (dispatch) => ({
  addMedical: (medical) => dispatch(addMedical(medical)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Medical);
