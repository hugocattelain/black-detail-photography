import { createMuiTheme } from '@material-ui/core';

const muiBlack = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#616161',
    },
  },
  typography: { fontFamily: 'brandon-grotesque-light' },
  overrides: {
    MuiButton: { root: { fontSize: '1.3rem' } },
    MuiTypography: {
      root: {},
      title: { fontSize: '4rem' },
      subheading: {},
      body1: { fontSize: '2rem' },
      body2: {},
    },
    MuiInput: { root: { fontSize: '1.5rem' } },
    MuiFormLabel: { root: { fontSize: '1.5rem' } },
    MuiFormControlLabel: {
      root: { fontSize: '1.7rem' },
      label: { fontSize: '1.7rem' },
    },
    MuiListItemText: {
      primary: { fontSize: '1.4rem' },
      secondary: { fontSize: '0.8rem' },
    },
  },
});

export default muiBlack;
