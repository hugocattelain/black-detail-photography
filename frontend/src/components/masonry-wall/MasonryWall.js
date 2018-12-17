import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Diaporama from '../diaporama/Diaporama';
import LandingPage from '../landing-page/LandingPage';
import Lightbox from '../lightbox/Lightbox';
import Client from '../../Client';

import CircularProgress from '@material-ui/core/CircularProgress';
import $ from 'jquery';
// eslint-disable-next-line
import lazysizes from 'lazysizes';

import { getCategoryName } from '../../Utils';

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
    const category = getCategoryName(this.props.match.params.category);
    const param =
      this.props.safeMode && category !== ('portrait' || 'architecture')
        ? 'portrait'
        : category;
    Client.getImages(param, images => {
      this.setState({
        images: images,
        loading: false,
      });
    });
  };

  componentWillReceiveProps = nextProps => {
    const nextCategory = getCategoryName(nextProps.match.params.category);
    const currentCategory = getCategoryName(this.props.match.params.category);
    if (nextCategory !== currentCategory) {
      window.scrollTo(0, 0);
      const param =
        this.props.safeMode && nextCategory !== ('portrait' || 'architecture')
          ? 'portrait'
          : nextCategory;
      this.setState({ loading: true });
      Client.getImages(param, images => {
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
    this.props.history.push(`/${category}&${id}`);
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

    const childElements = images.map((item, key) => {
      const id = item.id;
      const thumb = item.src.replace('upload', 'upload/t_web_small');
      return (
        <li
          key={key}
          className="masonry-layout__panel"
          onClick={() => this.openLightbox(id)}
        >
          <img
            src={thumb}
            data-expand="600"
            data-src={item.src.replace('upload', 'upload/t_web_large')}
            alt={item.title || 'Black Detail Photography'}
            className="masonry-layout__panel-content lazyload"
          />
        </li>
      );
    });

    return (
      <div>
        <LandingPage category={category} />
        <div
          className={'container ' + (diaporamaIsPlaying ? 'no-overflow' : null)}
        >
          {!this.state.loading ? (
            <ul className="masonry-layout">{childElements}</ul>
          ) : (
            <CircularProgress
              className="global__progress-bar"
              size={30}
              thickness={2}
            />
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
