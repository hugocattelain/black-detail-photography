// Libraries
import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [cookies, setCookies] = useState(false);

  useEffect(() => {
    if (
      document.cookie.split(';').filter(item => {
        return item.includes('cookie_consent=');
      }).length
    ) {
      setCookies(true);
    }

    return () => {};
  }, []);

  const accept = () => {
    document.cookie = 'cookie_consent=true; max-age=63072000';
    setCookies(true);
  };

  return (
    <div className={'cookie-consent__container ' + (cookies ? 'ninja' : '')}>
      <div className='cookie-consent__text'>
        This website uses cookies to ensure you get the best experience.
      </div>
      <button className='cookie-consent__button' onClick={accept}>
        OK
      </button>
    </div>
  );
};

export default CookieConsent;
