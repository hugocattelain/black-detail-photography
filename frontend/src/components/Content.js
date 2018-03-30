import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Admin from './Admin';
import MasonryWall from './MasonryWall';
import Lightbox from './Lightbox';
import Contact from './Contact';
import NotificationPreferences from './NotificationPreferences';

import '../styles/content.scss';

const Content = () => {

  return(
    <Switch>

      <Route exact path='/' component={MasonryWall} />
      <Route exact path='/admin' component={Admin} />
      <Route exact path='/contact' component={Contact} />
      <Route exact path='/notifications/:email/:subscriptionType' component={NotificationPreferences} />
      <Route exact path='/:category' component={MasonryWall} />
      <Route exact path='/:category/:id' component={Lightbox} />

    </Switch>
  );
}

export default Content;
