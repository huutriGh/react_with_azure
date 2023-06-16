import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import validate from 'validate.js';
import { addEvent } from './../../redux/claim/claim.actions';
import { selectEvent } from './../../redux/claim/claim.selector';
import SubmitButton from './SubmitButton';
//import { vi } from 'date-fns/locale';

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

let _eventPlace = {
  presence: {
    allowEmpty: false,
    message: '^Vui lòng nhập nơi xảy ra sự kiện',
  },
  length: {
    maximum: 50,
    message: '^Nơi xảy ra sự kiện không được vượt quá 50 ký tự',
  },
};
let _eventDiscription = {
  presence: {
    allowEmpty: false,
    message: '^Vui lòng tóm tắt diễn tiến của sự việc',
  },
  length: {
    maximum: 500,
    message:
      '^Nội dung tóm tắt diễn tiến của sự việc không được vượt quá 500 ký tự',
  },
};
// validation schema
const schema = {
  eventDate: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng chọn ngày xảy ra sự kiện',
    },
    datetime: {
      dateOnly: false,
      // latest: moment.utc().subtract(18, 'years'),
      // message: '^You need to be at least 18 years old',
    },
  },
  eventPlace: _eventPlace,
  eventReason: {
    presence: {
      allowEmpty: false,
      message: '^Vui lòng nhập nguyên nhân xảy ra sự kiện',
    },
    length: {
      maximum: 100,
      message: '^Nguyên nhân xảy ra sự kiện không được vượt quá 100 ký tự',
    },
  },
  eventDiscription: _eventDiscription,
};

const Event = ({ eventIns, addEvent, nextStep, previousStep, formType }) => {
  const [events, setState] = useState({
    values: eventIns,
    touched: {},
    errors: {},
    isValid: false,
  });

  // Validateion
  useEffect(() => {
    _eventPlace.presence.allowEmpty = true;
    _eventDiscription.presence.allowEmpty = true;
    let errors = validate(
      events.values,
      formType === 'Clm01'
        ? schema
        : {
            ...schema,
            eventDiscription: _eventDiscription,
            eventPlace: _eventPlace,
          }
    );
    if (
      formType === 'Clm01' &&
      events.values.eventDiscription !== '' &&
      events.values.eventDiscription.length <= 500
    ) {
      errors = null;
    }
    setState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [events.values, formType]);

  //

  const hasError = (field) =>
    events.touched[field] && events.errors[field] ? true : false;

  const handleChange = (event) => {
    if (event != null && validate.isDate(event) === false) {
      setState({
        ...events,
        values: {
          ...events.values,
          [event.target.name]:
            event.target.type === 'checkbox'
              ? event.target.checked
              : event.target.value,
        },
        touched: {
          ...events.touched,
          [event.target.name]: true,
        },
      });
    } else {
      setState({
        ...events,
        values: {
          ...events.values,
          eventDate:
            event != null && event.toString() !== 'Invalid Date'
              ? moment(event).format('YYYY-MM-DD')
              : null,
        },
        touched: {
          ...events.touched,
          eventDate: true,
        },
      });
    }
  };

  const handleAction = () => {
    addEvent(events.values);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {formType === 'Clm01' ? (
          <Grid item xs={12} />
        ) : (
          <React.Fragment>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Ngày hiệu lực'
                  inputFormat='dd/MM/yyyy'
                  value={events.values.eventDate}
                  onChange={handleChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size='small'
                      error={hasError('eventDate')}
                      variant='outlined'
                      helperText={
                        hasError('eventDate')
                          ? events.errors.eventDate[0]
                          : null
                      }
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='eventPlace'
                label='Nơi xảy ra sự kiện'
                fullWidth
                variant='outlined'
                size='small'
                value={events.values.eventPlace}
                onChange={handleChange}
                error={hasError('eventPlace')}
                helperText={
                  hasError('eventPlace') ? events.errors.eventPlace[0] : null
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                name='eventReason'
                label='Nguyên nhân'
                fullWidth
                variant='outlined'
                size='small'
                value={events.values.eventReason}
                onChange={handleChange}
                error={hasError('eventReason')}
                helperText={
                  hasError('eventReason') ? events.errors.eventReason[0] : null
                }
              />
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={12}>
          <TextField
            name='eventDiscription'
            label='Mô tả diễn tiến sự việc'
            fullWidth
            multiline
            variant='outlined'
            size='small'
            value={events.values.eventDiscription}
            onChange={handleChange}
            error={hasError('eventDiscription')}
            helperText={
              hasError('eventDiscription')
                ? events.errors.eventDiscription[0]
                : null
            }
          />
        </Grid>
        <SubmitButton
          isValid={!events.isValid}
          actionBack={handleAction}
          actionNext={handleAction}
        />
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  eventIns: selectEvent,
});

const mapDispatchToProps = (dispatch) => ({
  addEvent: (event) => dispatch(addEvent(event)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Event);
