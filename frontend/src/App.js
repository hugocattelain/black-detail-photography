import React, { Component } from 'react';

import Header from './components/header/Header';
import Router from './router';
import CookieConsent from './components/cookie-consent/CookieConsent';
import Maintenance from './components/maintenance/Maintenance';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

import './styles/app.css';
import { withRouter } from 'react-router-dom';

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

const headerLink = [
  {
    path: '/',
    title: 'Fine art nude',
  },
  {
    path: '/portrait',
    title: 'Portrait',
  },
  {
    path: '/architecture',
    title: 'Architecture',
  },
  /* {
    path: '/editorial',
    title: 'Editorial',
  }, */
  {
    path: '/contact',
    title: 'Contact',
  },
];

class App extends Component {
  state = {
    maintenanceMode:
      process.env.REACT_APP_MAINTENANCE_MODE === 'true' ? true : false,
    safeMode: window.localStorage.safeMode === 'true' ? true : false,
  };

  componentDidMount = () => {
    this.redirectUser(
      this.state.safeMode,
      this.state.maintenanceMode,
      this.props.history.location.pathname
    );

    this.props.history.listen((location, action) => {
      if (location.pathname === '/' || location.pathname === '/photography') {
        this.redirectUser(
          this.state.safeMode,
          this.state.maintenanceMode,
          location.pathname
        );
      }
    });
  };

  componentWillReceiveProps = (nextProp, nextState) => {
    const safeMode = window.localStorage.safeMode === 'true' ? true : false;
    if (
      nextProp.history.location.pathname !==
      this.props.history.location.pathname
    ) {
      this.redirectUser(
        safeMode,
        this.state.maintenanceMode,
        nextProp.history.location.pathname
      );
    }
  };

  redirectUser = (safeMode, maintenanceMode, targetLocation) => {
    if (safeMode && (targetLocation === '/' || '/home')) {
      this.props.history.push('/portrait');
    }
    if (maintenanceMode && targetLocation !== '/') {
      this.props.history.push('/');
    }
    if (targetLocation === '/photography') {
      window.localStorage.safeMode = 'true';
      this.setState({ safeMode: true });
      this.props.history.push('/portrait');
    }
    if (targetLocation === '/unsafe') {
      window.localStorage.safeMode = 'false';
      this.setState({ safeMode: false });
      this.props.history.push('/');
    }
  };

  render() {
    let { maintenanceMode, safeMode } = this.state;
    const menuLinks = safeMode ? headerLink.slice(1) : headerLink;

    return maintenanceMode ? (
      <div className="App">
        <Maintenance safeMode={safeMode} />
      </div>
    ) : (
      <MuiThemeProvider theme={muiBlack}>
        <div className="App">
          <Header menuLinks={menuLinks} safeMode={safeMode} />
          <Router safeMode={safeMode} />
          <CookieConsent />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
