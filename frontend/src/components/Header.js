import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import SocialMedia from './SocialMedia';

import '../styles/header.scss';

const mql = window.matchMedia(`(min-width: 768px)`);

class Header extends Component {
  constructor(props) {
		super(props);

		this.state = {
			mql: mql,
			menuIsOpen: false //Menu bugs out if set to true initial on push mode
		}

		this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
	}

  componentDidMount = () =>{
    this.setState({ mql: mql, menuIsOpen: this.state.mql.matches });
  }

  componentWillMount = () => {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount = () => {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged = () => {
    this.setState({ menuIsOpen: this.state.mql.matches });
  }
  render(){
    return(
      <Menu isOpen={this.state.menuIsOpen} noOverlay disableOverlayClick width={ '23%' } >
        <div className="navbar-logo" onClick={e => {this.props.history.push('/')}}></div>
        <ul className="menu-list">
          <li className="menu-item"><Link to='/'>Home</Link></li>
          <li className="menu-item"><Link to='/curves'>Curves</Link></li>
          <li className="menu-item"><Link to='/black'>Black</Link></li>
          <li className="menu-item"><Link to='/mask'>Mask</Link></li>
          <li className="menu-item"><Link to='/wall'>Wall</Link></li>
          <li className="menu-item"><Link to='/contact'>Contact</Link></li>
        </ul>
        <SocialMedia />
        <div className="copyright">
          Copyright © All rights <br/> reserved.
        </div>
      </Menu>
    )
  }
}

export default withRouter(Header);
