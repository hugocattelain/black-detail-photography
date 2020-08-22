import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from '../../Client';
import ShareButton from '../ShareButton/ShareButton';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';

import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@material-ui/core';
import email from '../../images/email.png';

class SocialMedia extends Component {
  state = {
    modalIsOpen: false,
    userEmail: '',
    subscriptionProgress: 'todo',
    snackbarIsOpen: false,
    message: '',
  };

  static propTypes = {
    pathname: PropTypes.string,
  };

  static defaultProps = {
    pathname: '/',
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

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { modalIsOpen, subscriptionProgress } = this.state;
    const { pathname } = this.props;
    const url = `https://www.black-detail.com${pathname}`;

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

          <ShareButton
            url={url}
            parent="header__"
            anchorHorizontal="right"
            anchorVertical="center"
            transformHorizontal="left"
            transformVertical="center"
          />

          <i
            className="social__notifications-button shake shake-rorate material-icons"
            onClick={this.handleOpenModal}
          >
            notifications
          </i>

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
