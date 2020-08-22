import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MasonryBrick from './MasonryBrick';
import Diaporama from '../diaporama/Diaporama';
import LandingPage from '../landing-page/LandingPage';
import Lightbox from '../lightbox/Lightbox';
import Client from '../../Client';

import CircularProgress from '@material-ui/core/CircularProgress';
import $ from 'jquery';
// eslint-disable-next-line
import lazysizes from 'lazysizes';

import ImageService from '../../services/image.service';

import './masonry.css';

class MasonryWall extends Component {
  state = {
    images: [],
    loading: false,
    diaporamaIsPlaying: false,
  };

  componentDidMount = () => {
    $(document).on(
      'mozfullscreenchange webkitfullscreenchange fullscreenchange',
      function(e) {
        let fullScreenMode =
          document.fullScreen ||
          document.mozFullScreen ||
          document.webkitIsFullScreen;
        if (!fullScreenMode) {
          this.setState({ diaporamaIsPlaying: false });
        }
      }.bind(this)
    );

    window.scrollTo(0, 0);
    $('.landing-page__title').addClass('faded');
    this.setState({ loading: true });
    const category = ImageService.getCategoryName(
      this.props.match.params.category
    );
    const param =
      this.props.safeMode &&
      category !== ('portrait' || 'architecture' || 'admin' || 'contact')
        ? 'portrait'
        : category;
    Client.getImages(param, images => {
      this.setState({
        images: images,
        loading: false,
      });
    });
  };

  componentWillUpdate = (nextProps, nextState) => {
    let nextCategory = ImageService.getCategoryName(
      nextProps.match.params.category
    );
    const currentCategory = ImageService.getCategoryName(
      this.props.match.params.category
    );

    nextCategory =
      this.props.safeMode && nextCategory === 'nsfw'
        ? 'portrait'
        : nextCategory;
    /* const param =
      this.props.safeMode && nextCategory === 'nsfw'
        ? 'portrait'
        : nextCategory; */
    console.log('Categories: ', currentCategory, nextCategory);
    if (nextCategory !== currentCategory) {
      window.scrollTo(0, 0);
      this.setState({ loading: true });
      Client.getImages(nextCategory, images => {
        this.setState({
          images: images,
          loading: false,
        });
      });
    }
  };

  openLightbox = id => {
    const category =
      this.props.match.params.category === undefined
        ? 'home'
        : this.props.match.params.category;
    this.props.history.push(`/${category}/${id}`);
  };

  toggleDiaporama = () => {
    this.setState({ diaporamaIsPlaying: !this.state.diaporamaIsPlaying });
  };

  render() {
    const { images, diaporamaIsPlaying } = this.state;
    let id = this.props.match.params.id;
    const category =
      this.props.match.params.category === undefined
        ? 'home'
        : this.props.match.params.category;
    const childElements = images.map(item => {
      return (
        <MasonryBrick
          item={item}
          key={item.id}
          openLightbox={this.openLightbox}
        />
      );
    });

    return (
      <div>
        <LandingPage category={category} />
        <div
          className={'container ' + (diaporamaIsPlaying ? 'no-overflow' : null)}
        >
          {this.state.loading ? (
            <CircularProgress
              className='global__progress-bar'
              size={30}
              thickness={2}
            />
          ) : (
            <div>
              <div>
                {category}
                {images.length}
              </div>
              <ul className='masonry-layout'>{childElements}</ul>
            </div>
          )}
          <i
            className={
              'material-icons diaporama-icon ' +
              (id > 0 ? 'diaporama-icon--white' : null)
            }
            onClick={this.toggleDiaporama}
          >
            fullscreen
          </i>
          {diaporamaIsPlaying && <Diaporama images={images} />}
          {id > 0 && <Lightbox images={images} id={Number(id)} />}
        </div>
      </div>
    );
  }
}

export default withRouter(MasonryWall);
