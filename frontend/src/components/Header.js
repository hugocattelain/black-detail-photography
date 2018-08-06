import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import $ from "jquery";

import SocialMedia from './SocialMedia';
import '../styles/header.css';

let lastScrollPos = 0;

class Header extends Component {

	state = {
		menuIsOpen: false, //Menu bugs out if set to true initial on push mode
    scrollDirection:'unset',
	};

  componentWillMount = () => {
    window.addEventListener("scroll", this.toggleHeader, false);
  }

  componentDidMount = () =>{
    $(".hamburger").on("click", () => {
      this.setState({ menuIsOpen: !this.state.menuIsOpen });
    });
    $(".menu-item").on("click", () => {
      this.setState({ menuIsOpen: false });
    });
  }
	componentWillReceiveProps = (nextProps) => {
			$(".mini-navbar").removeClass("gone");
      $(".hamburger").removeClass("gone");
			this.setState({ menuIsOpen: false });
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
    window.removeEventListener("scroll", this.toggleHeader, false);
  }

  toggleHeader= () => {
		if(window.scrollY>$('.mini-navbar').height() + window.innerHeight){
	    if(window.scrollY>lastScrollPos){
	      this.setState({ scrollDirection: 'down' });
	    }
	    else {
	      this.setState({ scrollDirection: 'up' });
	    }
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
            <li className="menu-item"><Link to='/'>Fine art nude</Link></li>
            {/*<li className="menu-item"><Link to='/curves'>Curves</Link></li>
             <li className="menu-item"><Link to='/black'>Black</Link></li> */}
            <li className="menu-item"><Link to='/portrait'>Portrait</Link></li>
            <li className="menu-item"><Link to='/architecture'>Architecture</Link></li>
            <li className="menu-item"><Link to='/contact'>Contact</Link></li>
          </ul>
          {/*<SocialMedia />*/}

					<a href="//www.dmca.com/Protection/Status.aspx?ID=9b98059e-c870-4227-a6b0-13ea302f8127" title="DMCA.com Protection Status" className="dmca-badge" target="_blank" rel="noopener noreferrer">
					<div className="copyright">
						Copyright © All rights <br/> reserved.
					</div>
					</a>
					<script src="//images.dmca.com/Badges/DMCABadgeHelper.min.js"> </script>
        </Menu>
      </div>
    )
  }
}

export default withRouter(Header);
