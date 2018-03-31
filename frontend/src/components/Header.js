import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import SocialMedia from './SocialMedia';
import $ from "jquery";

import '../styles/header.scss';

//const mql = window.matchMedia(`(min-width: 768px)`);
let lastScrollPos = 0;

class Header extends Component {

	state = {
		//mql: mql,
		menuIsOpen: false, //Menu bugs out if set to true initial on push mode
    scrollDirection:'unset',
	};

  componentWillMount = () => {
    //mql.addListener(this.mediaQueryChanged);
    window.addEventListener("scroll", this.toggleHeader, false);
  }

  componentDidMount = () =>{
    //this.setState({ mql: mql, menuIsOpen: this.state.mql.matches });
    $(".hamburger").on("click", () => {
      this.setState({ menuIsOpen: !this.state.menuIsOpen });
    });
    $(".menu-item").on("click", () => {
      this.setState({ menuIsOpen: false });
    });
  }
	componentWillReceiveProps = (nextProps) => {
		if(nextProps.location.pathname.match(/\d/i)){
			$(".mini-navbar").addClass("gone");
      $(".hamburger").addClass("gone");
			this.setState({ menuIsOpen: false });
		}
	}
  componentWillUpdate = (nextProps, nextState) => {
    if (this.state.scrollDirection === "up"){
      $(".mini-navbar").removeClass("gone");
      $(".hamburger").removeClass("gone");
    }
		else{
			$(".mini-navbar").addClass("gone");
      $(".hamburger").addClass("gone");
		}
    if (this.state.menuIsOpen !== nextState.menuIsOpen){
      $(".hamburger").toggleClass("is-active");
    }
  }

  componentWillUnmount = () => {
    //this.state.mql.removeListener(this.mediaQueryChanged);
    window.removeEventListener("scroll", this.toggleHeader, false);
  }

  // mediaQueryChanged = () => {
  //   this.setState({ menuIsOpen: this.state.mql.matches });
  // }

  toggleHeader= () => {
    if(window.scrollY>lastScrollPos){
      this.setState({ scrollDirection: 'down' });
    }
    else {
      this.setState({ scrollDirection: 'up' });
    }
    lastScrollPos = window.scrollY;
  }

  render(){

    return(
      <div>
        <button className="hamburger hamburger--spin" type="button">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
        <div className="mini-navbar"><div className='mini-navbar__home-banner' onClick={e => {this.props.history.push('/')}}></div></div>
        <Menu isOpen={this.state.menuIsOpen} noOverlay disableOverlayClick >
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
      </div>
    )
  }
}

export default withRouter(Header);
