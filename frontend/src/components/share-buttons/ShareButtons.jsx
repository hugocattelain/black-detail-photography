// Libraries
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from 'react-share';

// UI Components
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const hashtags = ['fineart', 'photography', 'portrait', 'blackandwhite', 'bnw'];

const SocialMediaShare = ({
  url,
  title,
  description,
  media,
  label,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  const handleClickShare = event => {
    event.preventDefault();
    setPopoverIsOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={`${props.parent}share-container`}>
      <i
        className={`material-icons ${props.parent}share-button`}
        onClick={e => handleClickShare(e)}
      >
        {label}
      </i>

      <Menu
        style={{ zIndex: 999999999 }}
        className='share__menu'
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={popoverIsOpen}
        anchorOrigin={{
          horizontal: props.anchorHorizontal,
          vertical: props.anchorVertical,
        }}
        transformOrigin={{
          horizontal: props.transformHorizontal,
          vertical: props.transformVertical,
        }}
        onClose={e => setPopoverIsOpen(false)}
      >
        <MenuItem
          className='share__button-facebook'
          onClick={e => setPopoverIsOpen(false)}
        >
          <FacebookShareButton url={url} quote={description}>
            Share on Facebook
          </FacebookShareButton>
        </MenuItem>
        <Divider />
        <MenuItem
          className='share__button-twitter'
          onClick={e => setPopoverIsOpen(false)}
        >
          <TwitterShareButton url={url} title={title} hashtags={hashtags}>
            Share on Twitter
          </TwitterShareButton>
        </MenuItem>
        <Divider />
        <MenuItem
          className='share__button-pinterest'
          onClick={e => setPopoverIsOpen(false)}
        >
          <PinterestShareButton
            url={url}
            description={description}
            media={media}
          >
            Pin on Pinterest
          </PinterestShareButton>
        </MenuItem>
      </Menu>
    </div>
  );
};

SocialMediaShare.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  media: PropTypes.string,
  label: PropTypes.string,
  parent: PropTypes.string,
  anchorHorizontal: PropTypes.string,
  anchorVertical: PropTypes.string,
  transformHorizontal: PropTypes.string,
  transformVertical: PropTypes.string,
};

SocialMediaShare.defaultProps = {
  url: 'https://www.black-detail.com',
  title: 'Black Detail - Portfolio',
  description:
    'Black Detail Photography portfolio. Portrait, Fashion, Architecture.',
  media:
    'https://res.cloudinary.com/blackdetail/image/upload/t_web_large/v1533369369/Util/20180204_030923_2.jpg',
  label: 'share',
  parent: '',
  anchorHorizontal: 'left',
  anchorVertical: 'top',
  transformHorizontal: 'right',
  transformVertical: 'top',
};

export default SocialMediaShare;
