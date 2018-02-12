import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import '../styles/header.css';

const Header = () => (
  <Menu noOverlay disableOverlayClick>
    <ul>
      <li className="menu-item"><Link to='/'>Home</Link></li>
      <li className="menu-item"><Link to='/nude'>Curves</Link></li>
      <li className="menu-item"><Link to='/bnw'>Black</Link></li>
      <li className="menu-item"><Link to='/portrait'>Mask</Link></li>
      <li className="menu-item"><Link to='/architecture'>Wall</Link></li>
    </ul>
  </Menu>
)

export default Header;
