import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
//import MasonryWall from './MasonryWall';
import '../styles/content.css';
import Admin from './Admin';
import MasonryWall from './MasonryWall';

const Content = () => (

  <div>
    <Switch>
    <Route exact path='/' component={MasonryWall}/>
      <Route exact path='/:category' component={MasonryWall}/>

      <Route exact path='/admin' component={Admin}/>
    </Switch>
  </div>
)

export default Content;
