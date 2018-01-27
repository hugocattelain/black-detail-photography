import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import Content from './components/Content';
import Admin from './components/Admin';

class App extends Component {

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Black Detail Photography BITCH</h1>
        </header> */}
        <Header />
        <Content />
        <Admin />


      </div>
    );
  }
}

export default App;
