import React, { Component } from 'react';

import Header from './components/Header';
import Content from './components/Content';
import CookieConsent from './components/CookieConsent';
import Maintenance from './components/Maintenance';

import './app.css';

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
        <Content />
        <CookieConsent />
      </div>
    );
  }
}

export default App;
