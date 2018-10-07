import React, { Component } from 'react';
import $ from 'jquery';
import { Fade } from 'react-slideshow-image';
import '../styles/diaporama.css';

const fadeProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: false,
};

class Diaporama extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeImages: [],
    };
  }

  componentDidMount() {
    let images = this.shuffle(this.props.images);
    images = images.map(img => img.src);
    this.setState({ fadeImages: images });
    this.openFullscreen();
  }

  componentWillUnmount = () => {
    $('body').removeClass('no-overflow');
  };

  openFullscreen = () => {
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

  shuffle(array) {
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
  }

  render() {
    const { fadeImages } = this.state;
    if (!fadeImages[0]) {
      return null;
    }

    return (
      <div className="diaporama__container">
        <Fade {...fadeProperties}>
          {fadeImages.map(image => (
            <div className="each-fade">
              <div className="image-container">
                <div
                  className="image-item"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            </div>
          ))}
        </Fade>
      </div>
    );
  }
}

export default Diaporama;
