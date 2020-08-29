// Libraries
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import $ from 'jquery';
import HttpsRedirect from 'react-https-redirect';

// Components
import NotificationPreferences from '@components/email-preferences/EmailPreferences';
import Admin from '@components/admin/Admin';
import Masonry from '@components/masonry-wall/MasonryWall';
import Contact from '@components/contact/Contact';

// Utils
import { copyToClipboard } from './Utils';

// Styles
import './styles/content.scss';

class Router extends Component {
  componentDidMount = () => {
    $(window).on('keyup', function(e) {
      if (e.keyCode === 44) {
        copyToClipboard();
      }
    });
  };

  render() {
    const { safeMode } = this.props;
    return (
      <HttpsRedirect>
        <Switch>
          <Route exact path='/photography' component={Masonry} />
          <Route exact path='/' component={Masonry} />
          <Route exact path='/admin' component={Admin} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/editorial' component={Masonry} />
          <Route
            exact
            path='/notifications/:email/:subscriptionType'
            component={NotificationPreferences}
          />
          <Route
            path='/:category/:id'
            component={Masonry}
            safeMode={safeMode}
          />
          <Route path='/:category' component={Masonry} safeMode={safeMode} />
        </Switch>
      </HttpsRedirect>
    );
  }
}

export default Router;
