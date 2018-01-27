import React, { Component } from 'react';
import MasonryWall from './MasonryWall';
import '../styles/content.css';

class Content extends Component {

  render() {
    return (
      <div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="container">
          <MasonryWall category="portrait"/>
        </div>
      </div>
    );
  }
}

export default Content;
