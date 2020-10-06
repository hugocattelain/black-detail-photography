// Libraries
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Fade } from 'react-slideshow-image';

// Styles
import './diaporama.scss';

const fadeProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: false,
};

const Diaporama = ({ images }) => {
  const [fadeImages, setFadeImages] = useState([]);

  useEffect(() => {
    setFadeImages(shuffle(images).map(img => img.src));
    openFullscreen();

    return () => {
      $('body').removeClass('no-overflow');
    };
  }, []);

  const openFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
    $('body').addClass('no-overflow');
  };

  const shuffle = array => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  if (!fadeImages[0]) {
    return null;
  }

  return (
    <div className='diaporama__container'>
      <Fade {...fadeProperties}>
        {fadeImages.map((image, index) => (
          <div className='each-fade' key={index}>
            <div className='image-container'>
              <div
                className='image-item'
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default Diaporama;
