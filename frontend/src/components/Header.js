import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import $ from "jquery";

import SocialMedia from "./SocialMedia";
import "../styles/header.css";

let lastScrollPos = 0;

class Header extends Component {
  state = {
    menuIsOpen: false, //Menu bugs out if set to true initial on push mode
    scrollDirection: "unset",
    menuLinks: [
      {
        path: "/",
        title: "Fine art nude"
      },
      {
        path: "/portrait",
        title: "Portrait"
      },
      {
        path: "/architecture",
        title: "Architecture"
      },
      {
        path: "/contact",
        title: "Contact"
      }
    ]
  };

  componentWillMount = () => {
    window.addEventListener("scroll", this.toggleHeader, false);
    if (
      window.localStorage.safeMode === "true" &&
      this.props.history.location.pathname === "/unsafe"
    ) {
      window.localStorage.safeMode = "false";
    }
    if (window.localStorage.safeMode === "true") {
      let safeLinkList = this.state.menuLinks.slice(1);
      this.setState({ menuLinks: safeLinkList });
    }
  };

  componentDidMount = () => {
    if (
      $(window).width() > 768 &&
      this.props.history.location.pathname !== "/admin"
    ) {
      this.setState({ menuIsOpen: true });
    }
    window.addEventListener("resize", this.updateDimensions);
    $(".hamburger").on("click", () => {
      this.setState({ menuIsOpen: !this.state.menuIsOpen });
    });
    $(".menu-item").on("click", () => {
      if ($(window).width() < 768) {
        this.setState({ menuIsOpen: false });
      }
    });
  };
  componentWillReceiveProps = nextProps => {
    $(".mini-navbar").removeClass("gone");
    $(".hamburger").removeClass("gone");
    if ($(window).width() < 768) {
      this.setState({ menuIsOpen: false });
    }
  };
  componentWillUpdate = (nextProps, nextState) => {
    if ($(window).width() < 768) {
      if (this.state.scrollDirection === "up") {
        $(".mini-navbar").removeClass("gone");
        $(".hamburger").removeClass("gone");
      } else {
        $(".mini-navbar").addClass("gone");
        $(".hamburger").addClass("gone");
      }
      if (this.state.menuIsOpen !== nextState.menuIsOpen) {
        $(".hamburger").toggleClass("is-active");
      }
    } else {
      $(".mini-navbar").addClass("gone");
      $(".hamburger").addClass("gone");
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
    window.removeEventListener("scroll", this.toggleHeader, false);
  };

  updateDimensions = () => {
    if (this.props.history.location.pathname !== "/admin") {
      if ($(window).width() < 768) {
        this.setState({ menuIsOpen: false });
        $(".mini-navbar").removeClass("gone");
        $(".hamburger").removeClass("gone");
      } else {
        this.setState({ menuIsOpen: true });
        $(".mini-navbar").addClass("gone");
        $(".hamburger").addClass("gone");
      }
    }
  };

  toggleHeader = () => {
    if (
      window.scrollY > $(".mini-navbar").height() + window.innerHeight &&
      this.props.history.location.pathname !== "/admin"
    ) {
      if (window.scrollY > lastScrollPos) {
        this.setState({ scrollDirection: "down" });
      } else {
        this.setState({ scrollDirection: "up" });
      }
    }
    lastScrollPos = window.scrollY;
  };

  render() {
    const { menuLinks } = this.state;
    return (
      <div>
        <button className="hamburger hamburger--spin" type="button">
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
        <div className="mini-navbar">
          <div
            className="mini-navbar__home-banner"
            onClick={e => {
              this.props.history.push("/");
            }}
          />
        </div>
        <Menu isOpen={this.state.menuIsOpen} noOverlay disableOverlayClick>
          <div
            className="navbar-logo"
            onClick={e => {
              this.props.history.push("/");
            }}
          />
          <ul className="menu-list">
            {menuLinks.map((menuItem, key) => (
              <li key={key} className="menu-item">
                <Link to={menuItem.path}>{menuItem.title}</Link>
              </li>
            ))}
          </ul>
          <SocialMedia />

          <a
            href="//www.dmca.com/Protection/Status.aspx?ID=9b98059e-c870-4227-a6b0-13ea302f8127"
            title="DMCA.com Protection Status"
            className="dmca-badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="copyright">
              Copyright © All rights <br /> reserved.
            </div>
          </a>
          <script src="//images.dmca.com/Badges/DMCABadgeHelper.min.js">
            {" "}
          </script>
        </Menu>
      </div>
    );
  }
}

export default withRouter(Header);
