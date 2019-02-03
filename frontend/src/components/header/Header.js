import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import SocialMedia from './SocialMedia';
import './header.css';

let lastScrollPos = 0;
const breakPoint = 768;

class Header extends Component {
  state = {
    menuIsOpen: false, //Menu bugs out if set to true initial on push mode
    scrollDirection: 'unset',
    largeDevice: $(window).width() > breakPoint,
    isLandingPageHidden: false,
  };

  componentDidMount = () => {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
    if (this.state.largeDevice) {
      this.setState({ menuIsOpen: true });
    }
    $('.hamburger').on('click', () => {
      this.setState(prevState => ({ menuIsOpen: !prevState.menuIsOpen }));
    });
    $('.menu-item').on('click', () => {
      if (!this.state.largeDevice) {
        this.setState({ menuIsOpen: false });
      }
    });
  };
  componentWillReceiveProps = (nextProps, nextState) => {
    this.state.largeDevice
      ? this.setState({ menuIsOpen: true })
      : this.setState({ menuIsOpen: false });
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  };

  onResize = () => {
    if ($(window).width() < breakPoint) {
      this.setState({ menuIsOpen: false, largeDevice: false });
    } else {
      this.setState({ menuIsOpen: true, largeDevice: true });
    }
  };

  onScroll = () => {
    window.scrollY > lastScrollPos
      ? this.setState({ scrollDirection: 'down' })
      : this.setState({ scrollDirection: 'up' });

    window.scrollY > window.innerHeight - $('.mini-navbar').height()
      ? this.setState({ isLandingPageHidden: true })
      : this.setState({ isLandingPageHidden: false });

    lastScrollPos = window.scrollY;
  };

  goToHomePage = safeMode => {
    safeMode
      ? this.props.history.push('/portrait')
      : this.props.history.push('/');
  };

  render() {
    const { menuLinks, safeMode } = this.props;
    const {
      menuIsOpen,
      scrollDirection,
      largeDevice,
      isLandingPageHidden,
    } = this.state;
    return (
      <div>
        <button
          className={
            'hamburger hamburger--spin ' +
            (menuIsOpen ? 'is-active ' : '') +
            (isLandingPageHidden && scrollDirection === 'down' ? ' gone' : '')
          }
          type="button"
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
        <div
          className={
            'mini-navbar ' +
            (largeDevice ? 'gone ' : '') +
            (isLandingPageHidden && scrollDirection === 'down' ? ' gone' : '')
          }
        >
          <div
            className="mini-navbar__home-banner"
            onClick={e => this.goToHomePage(safeMode)}
          />
        </div>
        <Menu isOpen={menuIsOpen} noOverlay disableOverlayClick>
          <div
            className="navbar-logo"
            onClick={e => this.goToHomePage(safeMode)}
          />
          <ul className="menu-list">
            {menuLinks.map((menuItem, key) => (
              <li key={key} className="menu-item">
                <Link to={menuItem.path}>{menuItem.title}</Link>
              </li>
            ))}
          </ul>

          <SocialMedia pathname={this.props.history.location.pathname} />

          {/* <a
            href="//www.dmca.com/Protection/Status.aspx?ID=9b98059e-c870-4227-a6b0-13ea302f8127"
            title="DMCA.com Protection Status"
            className="dmca-badge"
            target="_blank"
            rel="noopener noreferrer"
          > */}
          <div className="copyright">
            Copyright © All rights <br /> reserved.
          </div>
          {/* </a>
          <script src="//images.dmca.com/Badges/DMCABadgeHelper.min.js">
            {' '}
          </script> */}
        </Menu>
      </div>
    );
  }
}

export default withRouter(Header);
