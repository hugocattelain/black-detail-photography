import React from 'react';
import PropTypes from 'prop-types';
import $ from "jquery";
import '../styles/landing-page.css';
import quotes from '../ressources/quotes.json';

const LandingPage = ( {category} ) => {

  const getTitle = (category) => {
    switch(category){
      case "home":
        return "erotic portraits";
      case "mask":
        return "portraits";
      case "wall":
        return "architecture";
      default:
        return "erotic portraits";
    }
  }

  const getSubtitle = (category) => {
    const rand = Math.floor(Math.random() * 3) + 1;
    switch(category){
      case "home":
        return quotes.home[rand];
      case "mask":
        return quotes.mask[rand];
      case "wall":
        return quotes.wall[rand];
      default:
        return quotes.home[rand];
    }
  }

  const scroll = () => {
    const scrollAmount = ($('.container').offset().top - window.pageYOffset);
    window.scrollBy({top: scrollAmount, left: 0, behavior: 'smooth'});
  }

  return (
    <div className="landing-page__container">
      <div className="landing-page__title">{getTitle(category)}</div>
      <div className="landing-page__subtitle">"{getSubtitle(category)}"</div>
      <i className="material-icons landing-page__icon" onClick={scroll}>arrow_forward_ios</i>
    </div>
  );

}

LandingPage.propTypes = {
  category: PropTypes.string
};

LandingPage.defaultProps = {
  category: "fine art nude"
}

export default LandingPage;
