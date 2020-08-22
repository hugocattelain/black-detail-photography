import React from 'react';

export default function MasonryBrick(props) {
  const { item, openLightbox } = props;
  return (
    <li className='masonry-layout__panel' onClick={() => openLightbox(item.id)}>
      <img
        src={item.src.replace('upload', 'upload/t_web_small')}
        data-expand='600'
        data-src={item.src.replace('upload', 'upload/t_web_large')}
        alt={item.title || 'Black Detail Photography'}
        className='masonry-layout__panel-content lazyload'
      />
    </li>
  );
}
