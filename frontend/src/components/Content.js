import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Admin from './Admin';
// import MasonryWall from './MasonryWall';
import Masonry2 from './Masonry2';
import Contact from './Contact';
import NotificationPreferences from './NotificationPreferences';
import { copyToClipboard } from '../Utils';
import $ from "jquery";
import '../styles/content.scss';

class Content extends Component {

  componentDidMount = () => {
    $(window).on("keyup", function(e){
      console.log(e.keyCode);
      if(e.keyCode == 44){
        copyToClipboard();
      }
    });
  }

  render(){
    return(
      <Switch>

        <Route exact path='/' component={Masonry2} />
        <Route exact path='/admin' component={Admin} />
        <Route exact path='/contact' component={Contact} />
        <Route exact path='/notifications/:email/:subscriptionType' component={NotificationPreferences} />
        <Route path='/:category&:id' component={Masonry2} />
        <Route path='/:category' component={Masonry2} />

      </Switch>
    );
  }
}

export default Content;
