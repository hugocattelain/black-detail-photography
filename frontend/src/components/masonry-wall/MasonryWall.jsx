// Libraries
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';
// eslint-disable-next-line
import lazysizes from 'lazysizes';

// Components
import Client from '../../Client';
import Diaporama from '../diaporama/Diaporama';
import LandingPage from '../landing-page/LandingPage';
import Lightbox from '../lightbox/Lightbox';

// UI Components
import CircularProgress from '@material-ui/core/CircularProgress';

// Styles
import './masonry.scss';

const MasonryWall = ({ history, match, safeMode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diaporamaIsPlaying, setDiaporamaIsPlaying] = useState(false);
  let id = match.params.id;
  let category = match.params.category || 'home';

  useEffect(() => {
    category = match.params.category || 'home';
    const param =
      safeMode && category !== ('portrait' || 'architecture')
        ? 'portrait'
        : category;
    setLoading(true);
    $(document).on(
      'mozfullscreenchange webkitfullscreenchange fullscreenchange',
      e => {
        let fullScreenMode =
          document.fullScreen ||
          document.mozFullScreen ||
          document.webkitIsFullScreen;
        if (!fullScreenMode) {
          setDiaporamaIsPlaying(false);
        }
      }
    );

    window.scrollTo(0, 0);
    $('.landing-page__title').addClass('faded');
    Client.getImages(param, images => {
      setImages(images);
      setLoading(false);
    });
    return () => {};
  }, [match.params.category]);

  const childElements = images.map((image, key) => {
    const thumb = image.src.replace('upload', 'upload/t_web_small');
    return (
      <li
        key={key}
        className='masonry-layout__panel'
        onClick={e => history.push(`/${category}/${image.id}`)}
      >
        <img
          src={thumb}
          data-expand='600'
          data-src={image.src.replace('upload', 'upload/t_web_large')}
          alt={image.title || 'Black Detail Photography'}
          className='masonry-layout__panel-content lazyload'
        />
      </li>
    );
  });

  return (
    <div>
      <LandingPage category={category} />
      <div className={`container ${diaporamaIsPlaying ? 'no-overflow' : ''}`}>
        {!loading ? (
          <ul className='masonry-layout'>{childElements}</ul>
        ) : (
          <CircularProgress
            className='global__progress-bar'
            size={30}
            thickness={2}
          />
        )}
        <i
          className={`material-icons diaporama-icon ${
            id > 0 ? 'diaporama-icon--white' : ''
          }`}
          onClick={e => setDiaporamaIsPlaying(!diaporamaIsPlaying)}
        >
          fullscreen
        </i>
        {diaporamaIsPlaying && <Diaporama images={images} />}
        {id > 0 && <Lightbox images={images} id={Number(id)} />}
      </div>
    </div>
  );
};

export default withRouter(MasonryWall);
