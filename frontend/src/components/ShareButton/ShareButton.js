import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from 'react-share';

const hashtags = ['fineart', 'photography', 'portrait', 'blackandwhite', 'bnw'];

class SocialMediaShare extends Component {
  state = {
    anchorEl: null,
    popoverIsOpen: false,
  };

  static propTypes = {
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

  static defaultProps = {
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

  handleClickShare = event => {
    event.preventDefault();

    this.setState({
      popoverIsOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleClosePopover = () => {
    this.setState({
      popoverIsOpen: false,
    });
  };

  handleClosePopover = () => {
    this.setState({
      popoverIsOpen: false,
    });
  };

  render() {
    const {
      url,
      title,
      description,
      media,
      label,
      parent,
      anchorHorizontal,
      anchorVertical,
      transformHorizontal,
      transformVertical,
    } = this.props;
    const { anchorEl, popoverIsOpen } = this.state;

    return (
      <div className={parent + 'share-container'}>
        <i
          className={'material-icons ' + parent + 'share-button'}
          onClick={this.handleClickShare}
        >
          {label}
        </i>

        <Menu
          style={{ zIndex: 999999999 }}
          className="share__menu"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          open={popoverIsOpen}
          anchorOrigin={{
            horizontal: anchorHorizontal,
            vertical: anchorVertical,
          }}
          transformOrigin={{
            horizontal: transformHorizontal,
            vertical: transformVertical,
          }}
          onClose={this.handleClosePopover}
        >
          <MenuItem
            className="share__button-facebook"
            onClick={this.handleClosePopover}
          >
            <FacebookShareButton url={url} quote={description}>
              Share on Facebook
            </FacebookShareButton>
          </MenuItem>
          <Divider />
          <MenuItem
            className="share__button-twitter"
            onClick={this.handleClosePopover}
          >
            <TwitterShareButton url={url} title={title} hashtags={hashtags}>
              Share on Twitter
            </TwitterShareButton>
          </MenuItem>
          <Divider />
          <MenuItem
            className="share__button-pinterest"
            onClick={this.handleClosePopover}
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
  }
}

export default SocialMediaShare;
