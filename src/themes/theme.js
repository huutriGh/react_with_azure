import { createTheme } from '@material-ui/core';

import palette from './palette';

const theme = createTheme({
  overrides: {


    
    MuiStepIcon: {
      root: {
        '&$completed': {
          color: '#b88d27',
        },
        '&$active': {
          color: '#b88d27',
        },
      },
      active: {},
      completed: {},
    },
    MuiStepper: {
      root: {
        paddingLeft: '0px',
        paddingRight: '0px',
      },
    },
    MuiStepContent: {
      root: {
        marginTop: '8px',
        borderLeft: '1px solid #b88d27',
        paddingLeft: '20px',
        paddingRight: '8px',
      },
    },
    MuiStepConnector: {
      line: {
        borderColor: '#b88d27',
      },
    },
  },
  palette,
});

export default theme;
