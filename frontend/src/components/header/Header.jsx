// Libraries
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

// Components
import SocialMedia from './SocialMedia';

// UI Components
import { slide as Menu } from 'react-burger-menu';

// Styles
import './header.scss';

let lastScrollPos = 0;
const breakPoint = 768;

const Header = ({ history, menuLinks, safeMode }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false); //Menu bugs out if set to true initial on push mode
  const [scrollDirection, setScrollDirection] = useState('unset');
  const [largeDevice, setLargeDevice] = useState(
    window.innerWidth > breakPoint
  );
  const [isLandingPageHidden, setIsLandingPageHidden] = useState(false);
  const miniNavbar = useRef('');

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);

    if (largeDevice) setMenuIsOpen(true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [largeDevice]);

  const onResize = () => {
    if (window.innerWidth < breakPoint) {
      setMenuIsOpen(false);
      setLargeDevice(false);
    } else {
      setMenuIsOpen(true);
      setLargeDevice(true);
    }
  };

  const onScroll = () => {
    window.scrollY > lastScrollPos
      ? setScrollDirection('down')
      : setScrollDirection('up');

    window.scrollY > window.innerHeight - miniNavbar.current.clientHeight
      ? setIsLandingPageHidden(true)
      : setIsLandingPageHidden(false);

    lastScrollPos = window.scrollY;
  };

  const goToHomePage = safeMode => {
    safeMode ? history.push('/portrait') : history.push('/');
  };

  return (
    <div>
      <button
        className={
          'hamburger hamburger--spin ' +
          (isLandingPageHidden && scrollDirection === 'down' ? ' gone' : '')
        }
        type='button'
        onClick={e => setMenuIsOpen(!menuIsOpen)}
      >
        <span className='hamburger-box'>
          <span className='hamburger-inner' />
        </span>
      </button>
      <div
        className={
          'mini-navbar ' +
          (largeDevice ? 'gone ' : '') +
          (isLandingPageHidden && scrollDirection === 'down' ? ' gone' : '')
        }
        ref={miniNavbar}
      >
        <div
          className='mini-navbar__home-banner'
          onClick={e => goToHomePage(safeMode)}
        />
      </div>
      <Menu isOpen={menuIsOpen} noOverlay disableOverlayClick>
        <div className='navbar-logo' onClick={e => goToHomePage(safeMode)} />
        <ul className='menu-list'>
          {menuLinks.map((menuItem, key) => (
            <li
              key={key}
              className='menu-item'
              onClick={e => {
                if (!largeDevice) setMenuIsOpen(false);
              }}
            >
              <Link to={menuItem.path}>{menuItem.title}</Link>
            </li>
          ))}
        </ul>

        <SocialMedia pathname={history.location.pathname} />

        {/* <a
            href="//www.dmca.com/Protection/Status.aspx?ID=9b98059e-c870-4227-a6b0-13ea302f8127"
            title="DMCA.com Protection Status"
            className="dmca-badge"
            target="_blank"
            rel="noopener noreferrer"
          > */}
        <div className='copyright'>
          Copyright © All rights <br /> reserved.
        </div>
        {/* </a>
          <script src="//images.dmca.com/Badges/DMCABadgeHelper.min.js">
            {' '}
          </script> */}
      </Menu>
    </div>
  );
};

export default withRouter(Header);
