// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

// Styles
import './landing-page.scss';

// Assets
import quotes from '../../ressources/quotes.json';

const LandingPage = ({ category }) => {
  LandingPage.propTypes = {
    category: PropTypes.string,
  };

  LandingPage.defaultProps = {
    category: 'fine art nude',
  };

  const getTitle = category => {
    switch (category) {
      case 'home':
        return 'fine art nude';
      case 'portrait':
        return 'portraits';
      case 'architecture':
        return 'architecture';
      case 'editorial':
        return 'editorial';
      default:
        return 'fine art nude';
    }
  };

  const getSubtitle = category => {
    const rand = Math.floor(Math.random() * 3) + 1;
    switch (category) {
      case 'home':
        return quotes.home[rand];
      case 'portrait':
        return quotes.portrait[rand];
      case 'architecture':
        return quotes.architecture[rand];
      default:
        return quotes.home[rand];
    }
  };

  const scroll = () => {
    const scrollAmount = $('.container').offset().top - window.pageYOffset;
    window.scrollBy({ top: scrollAmount, left: 0, behavior: 'smooth' });
  };

  return (
    <div className='landing-page__container' onClick={scroll}>
      <div className='landing-page__title'>{getTitle(category)}</div>
      <div className='landing-page__subtitle'>"{getSubtitle(category)}"</div>
      <div>
        <i className='material-icons landing-page__icon'>arrow_forward_ios</i>
      </div>
    </div>
  );
};
export default LandingPage;
