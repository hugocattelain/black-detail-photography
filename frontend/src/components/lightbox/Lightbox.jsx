// Libraries
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import LB from 'lightbox-react';
import findIndex from 'lodash/findIndex';
import { Helmet } from 'react-helmet';
import $ from 'jquery';

// UI Components
import ShareButton from '../share-buttons/ShareButtons';

// Styles
import './lightbox.scss';

const Lightbox = ({ id, images, history, match }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const category = match.params.category || 'home';
  const url = `https://www.black-detail.com/${category}/${id}`;
  const src = images[photoIndex].src;

  useEffect(() => {
    setPhotoIndex(
      findIndex(images, el => {
        // eslint-disable-next-line
        return el.id == id;
      })
    );
    setIsOpen(id > 0);
    return () => {
      setIsOpen(false);
    };
  }, []);

  const closeLightbox = () => {
    $('.hamburger').removeClass('gone');
    $('.mini-navbar').removeClass('gone');
    setIsOpen(false);
    history.push(category === 'home' ? '/' : `/${category}`);
  };

  const prevPhoto = () => {
    const newIndex = photoIndex - 1 < 0 ? images.length - 1 : photoIndex - 1;
    setPhotoIndex(newIndex);
    history.push(`/${category}/${images[newIndex].id}`);
  };

  const nextPhoto = () => {
    setPhotoIndex((photoIndex + 1) % images.length);
    history.push(`/${category}/${images[(photoIndex + 1) % images.length].id}`);
  };

  if (images.length < 1) {
    return null;
  }
  return (
    <div>
      {isOpen && (
        <div>
          <Helmet>
            <meta name='image' content={src} />
            <meta itemprop='image' content={src} />
            <meta name='twitter:image' content={src} />
            <meta property='og:image' content={src} />
            <meta property='og:url' content={url} />
          </Helmet>
          <LB
            mainSrc={src}
            nextSrc={images[(photoIndex + 1) % images.length].src}
            prevSrc={
              images[(photoIndex + images.length - 1) % images.length].src
            }
            onCloseRequest={e => closeLightbox()}
            onMovePrevRequest={e => prevPhoto()}
            onMoveNextRequest={e => nextPhoto()}
            discourageDownloads={true}
            enableZoom={false}
            handleSwipe={true}
          />
          <ShareButton
            url={url}
            media={src}
            parent='lightbox__'
            anchorHorizontal='left'
            anchorVertical='top'
            transformHorizontal='right'
            transformVertical='top'
          />
        </div>
      )}
    </div>
  );
};

Lightbox.propTypes = {
  images: PropTypes.array.isRequired,
  id: PropTypes.number.isRequired,
};

export default withRouter(Lightbox);
