import React, { Component } from 'react';

import '../styles/content.css';

class CookieConsent extends Component {
  state = {
    cookies: false,
  };

  componentDidMount = () => {
    if (
      document.cookie.split(';').filter(item => {
        return item.includes('cookie_consent=');
      }).length
    ) {
      this.setState({ cookies: true });
    } else {
      this.setState({ cookies: false });
    }
  };
  accept = () => {
    document.cookie = 'cookie_consent=true; max-age=63072000';

    this.setState({ cookies: true });
  };

  render() {
    const { cookies } = this.state;
    return (
      <div className={'cookie-consent__container ' + (cookies ? 'ninja' : '')}>
        <div className="cookie-consent__text">
          This website uses cookies to ensure you get the best experience.
        </div>
        <button className="cookie-consent__button" onClick={this.accept}>
          OK
        </button>
      </div>
    );
  }
}

export default CookieConsent;
