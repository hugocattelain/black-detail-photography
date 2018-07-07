import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Admin from './Admin';
import MasonryWall from './MasonryWall';
import Contact from './Contact';
import NotificationPreferences from './NotificationPreferences';
import { copyToClipboard } from '../Utils';
import $ from "jquery";
import '../styles/content.css';

class Content extends Component {

  componentDidMount = () => {
    $(window).on("keyup", function(e){
      if(e.keyCode === 44){
        copyToClipboard();
      }
    });
  }

  render(){
    return(
      <Switch>

        <Route exact path='/' component={MasonryWall} />
        <Route exact path='/admin' component={Admin} />
        <Route exact path='/contact' component={Contact} />
        <Route exact path='/notifications/:email/:subscriptionType' component={NotificationPreferences} />
        <Route path='/:category&:id' component={MasonryWall} />
        <Route path='/:category' component={MasonryWall} />

      </Switch>
    );
  }
}

export default Content;
