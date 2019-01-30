import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from 'react-share';

import Client from '../../Client';
import email from '../../images/email.png';
import '../../styles/content.css';
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@material-ui/core';

class SocialMedia extends Component {
  state = {
    anchorEl: null,
    popoverIsOpen: false,
    modalIsOpen: false,
    userEmail: '',
    subscriptionProgress: 'todo',
    snackbarIsOpen: false,
    message: '',
  };

  componentDidMount = () => {
    if (window.localStorage.firstVisit !== 'false') {
      window.localStorage.firstVisit = 'true';
      document.addEventListener('mouseout', this.handleMouseOut);
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener('mouseout', this.handleMouseOut);
  };

  handleMouseOut = event => {
    if (event.clientY <= 0) {
      this.setState({ modalIsOpen: true });
    }
  };

  handleClickShare = event => {
    // This prevents ghost click.
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

  handleOpenModal = () => {
    this.setState({ modalIsOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalIsOpen: false });
    if (window.localStorage.firstVisit !== 'false') {
      document.removeEventListener('mouseout', this.handleMouseOut);
      window.localStorage.firstVisit = 'false';
    }
  };

  handleSnackbarClose = () => {
    this.setState({
      message: '',
      snackbarIsOpen: false,
    });
  };

  handleEmailNotifications = e => {
    e.preventDefault();
    this.setState({ subscriptionProgress: 'progress' });
    const data = {
      email: this.state.userEmail,
      subscription_type: 1,
    };
    Client.postEmail(data)
      .then(res => {
        this.setState({
          subscriptionProgress: 'done',
          snackbarIsOpen: true,
          message: 'Yay ! You just subscribed to the Newsletter',
        });
      })
      .catch(err => {
        this.setState({
          subscriptionProgress: 'todo',
          snackbarIsOpen: true,
          message: 'Oops, something went wrong. Sorry for that !',
        });
      });
  };

  handleWebNotifications = () => {
    this.setState({
      subscriptionProgress: 'done',
    });
  };

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const {
      anchorEl,
      modalIsOpen,
      popoverIsOpen,
      subscriptionProgress,
    } = this.state;
    const url = 'https://www.black-detail.com';
    const title = 'Black Detail - Portfolio';
    const description =
      'Black Detail Photography portfolio. Fine-art Nude, Portrait, Fashion, Architecture.';
    const media =
      'https://res.cloudinary.com/blackdetail/image/upload/t_web_large/v1533369369/Util/20180204_030923_2.jpg';
    const hashtags = [
      'fineart',
      'photography',
      'nude',
      'boudoir',
      'portrait',
      'blackandwhite',
      'bnw',
    ];

    return (
      <div>
        <div className="social__wrapper">
          <a
            href="https://www.instagram.com/blck.dtl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="social__item instagram" />
          </a>
          <a
            href="https://www.facebook.com/blck.dtl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="social__item facebook" />
          </a>
          <a
            href="https://www.eyeem.com/u/blck_dtl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="social__item eyeem" />
          </a>

          <div className="social__share__container col-xs-12">
            <Button
              variant="contained"
              onClick={this.handleClickShare}
              className="social__share-button"
            >
              Share
            </Button>
            <Menu
              className="share__menu"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              open={popoverIsOpen}
              anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
              transformOrigin={{ horizontal: 'left', vertical: 'center' }}
              onClose={this.handleClosePopover}
            >
              <MenuItem
                className="share__button-facebook"
                onClick={this.handleClosePopover}
              >
                <FacebookShareButton url={url}>
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

            <i
              className="social__notifications-button shake shake-rorate material-icons"
              onClick={this.handleOpenModal}
            >
              notifications
            </i>
          </div>

          <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={modalIsOpen}
            onClose={this.handleCloseModal}
            aria-labelledby="social__modal__title"
            className="social__modal"
          >
            <form onSubmit={e => this.handleEmailNotifications(e)}>
              <DialogTitle className="social__modal__title">
                {'Notifications'}
              </DialogTitle>
              <DialogContent>
                <img
                  className="social__modal-icon"
                  src={email}
                  alt="Newsletter_Icon"
                />
                {subscriptionProgress !== 'done' && (
                  <DialogContentText className="social__modal-text">
                    <Typography>
                      Subscribe to the newsletter to receive the latest updates.
                      <br />
                      Get notified when a new post comes up.
                    </Typography>
                  </DialogContentText>
                )}
                {this.state.subscriptionProgress === 'todo' && (
                  <div className="social__modal__actions col-xs-12">
                    <TextField
                      label="Email"
                      placeholder="Email address"
                      className="social__modal__input"
                      required={true}
                      type="email"
                      value={this.state.userEmail}
                      onChange={e => this.setInputState(e, 'userEmail')}
                    />
                  </div>
                )}

                {subscriptionProgress === 'done' && (
                  <div className="social__modal__success">
                    Congratulations ! You subscribed to the newsletter.{' '}
                  </div>
                )}
              </DialogContent>
              <DialogActions>
                {subscriptionProgress !== 'done' && (
                  <Button
                    variant="contained"
                    className="social__modal__actions__button"
                    color="primary"
                    type="submit"
                    disabled={subscriptionProgress === 'progress'}
                  >
                    OK
                  </Button>
                )}
                <Button onClick={this.handleCloseModal} variant="text">
                  {subscriptionProgress === 'done' ? 'Close' : 'No, thank you'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          <Snackbar
            open={this.state.snackbarIsOpen}
            message={this.state.message}
            autoHideDuration={4000}
            onClose={this.handleSnackbarClose}
          />
        </div>
      </div>
    );
  }
}

export default SocialMedia;
