import React, { Component } from 'react';

import Header from './components/header/Header';
import Router from './router';
import CookieConsent from './components/cookie-consent/CookieConsent';
import Maintenance from './components/maintenance/Maintenance';

import './styles/app.css';

class App extends Component {
  render() {
    const maintenanceMode =
      process.env.NODE_ENV === 'production'
        ? process.env.MAINTENANCE_MODE
        : process.env.REACT_APP_MAINTENANCE_MODE;
    return maintenanceMode === 'true' ? (
      <div className="App">
        <Maintenance />
      </div>
    ) : (
      <div className="App">
        <Header />
        <Router />
        <CookieConsent />
      </div>
    );
  }
}

export default App;
