import React, { Component } from 'react';
import Header from './components/header/Header';
import Router from './router';
import CookieConsent from './components/cookie-consent/CookieConsent';
import Maintenance from './components/maintenance/Maintenance';
import { MuiThemeProvider } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

import muiBlack from './styles/theme';
import './styles/app.css';

class App extends Component {
  state = {
    maintenanceMode:
      process.env.REACT_APP_MAINTENANCE_MODE === 'true' ? true : false,
    safeMode: window.localStorage.safeMode === 'true' ? true : false,
    images: [],
  };

  componentDidMount = () => {
    this.redirectUser(
      this.state.safeMode,
      this.state.maintenanceMode,
      this.props.history.location.pathname
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    const safeMode = window.localStorage.safeMode === 'true' ? true : false;
    if (
      prevProps.history.location.pathname !==
      this.props.history.location.pathname
    ) {
      console.log('App redirect');
      this.redirectUser(
        safeMode,
        this.state.maintenanceMode,
        this.props.history.location.pathname
      );
    }
    console.log('App update', prevProps, ' => ', this.props);
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

    return (
      <div>
        <Helmet>
          <meta
            name='image'
            content='https://res.cloudinary.com/blackdetail/image/upload/t_web_large/v1533369369/Util/20180204_030923_2.jpg'
          />
          <meta
            itemprop='image'
            content='https://res.cloudinary.com/blackdetail/image/upload/t_web_large/v1533369369/Util/20180204_030923_2.jpg'
          />
          <meta
            name='twitter:image'
            content='https://res.cloudinary.com/blackdetail/image/upload/t_web_large/v1533369369/Util/20180204_030923_2.jpg'
          />
          <meta
            property='og:image'
            content='https://res.cloudinary.com/blackdetail/image/upload/v1533369369/Util/20180204_030923_2.jpg'
          />
          <meta property='og:url' content='https://www.black-detail.com' />
        </Helmet>
        {maintenanceMode ? (
          <div className='App'>
            <Maintenance safeMode={safeMode} />
          </div>
        ) : (
          <MuiThemeProvider theme={muiBlack}>
            <div className='App'>
              <Header safeMode={safeMode} />
              <Router safeMode={safeMode} />
              <CookieConsent />
            </div>
          </MuiThemeProvider>
        )}
      </div>
    );
  }
}

export default withRouter(App);
