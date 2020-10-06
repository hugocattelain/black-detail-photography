// Libraries
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components
import Client from '../../Client';

// UI Components
import ShareButton from '../share-buttons/ShareButtons';
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

// Assets
import email from '@images/email.png';

const SocialMedia = ({ pathname }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subscriptionProgress, setSubscriptionProgress] = useState('todo');
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (window.localStorage.firstVisit !== 'false') {
      window.localStorage.firstVisit = 'false';
      setTimeout(
        () => document.addEventListener('mouseout', handleMouseOut),
        10000
      );
    }
    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const handleMouseOut = event => {
    if (event.clientY <= 0) {
      setModalIsOpen(true);
      document.removeEventListener('mouseout', handleMouseOut);
    }
  };

  const handleEmailNotifications = e => {
    e.preventDefault();
    setSubscriptionProgress('progress');
    const data = {
      email: userEmail,
      subscription_type: 2,
    };
    Client.postEmail(data)
      .then(res => {
        setSubscriptionProgress('done');
        setSnackbarIsOpen(true);
        setMessage('Yay ! You just subscribed to the Newsletter');
      })
      .catch(err => {
        setSubscriptionProgress('todo');
        setSnackbarIsOpen(true);
        setMessage('Oops, something went wrong. Sorry for that !');
      });
  };

  const url = `https://www.black-detail.com${pathname}`;

  return (
    <div>
      <div className='social__wrapper'>
        <a
          href='https://www.instagram.com/blck.dtl/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='social__item instagram' />
        </a>
        <a
          href='https://www.facebook.com/blck.dtl/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='social__item facebook' />
        </a>
        <a
          href='https://www.eyeem.com/u/blck_dtl'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='social__item eyeem' />
        </a>

        <ShareButton
          url={url}
          parent='header__'
          anchorHorizontal='right'
          anchorVertical='center'
          transformHorizontal='left'
          transformVertical='center'
        />

        <i
          className='social__notifications-button shake shake-rorate material-icons'
          onClick={e => setModalIsOpen(true)}
        >
          notifications
        </i>

        <Dialog
          fullWidth={true}
          maxWidth={'sm'}
          open={modalIsOpen}
          onClose={e => setModalIsOpen(false)}
          aria-labelledby='social__modal__title'
          className='social__modal'
        >
          <form onSubmit={e => handleEmailNotifications(e)}>
            <DialogTitle className='social__modal__title'>
              {'Notifications'}
            </DialogTitle>
            <DialogContent>
              <img
                className='social__modal-icon'
                src={email}
                alt='Newsletter_Icon'
              />
              {subscriptionProgress !== 'done' && (
                <DialogContentText className='social__modal-text'>
                  <Typography>
                    Subscribe to the newsletter to receive the latest updates.
                    <br />
                    Get notified when a new post comes up.
                  </Typography>
                </DialogContentText>
              )}
              {subscriptionProgress === 'todo' && (
                <div className='social__modal__actions col-xs-12'>
                  <TextField
                    label='Email'
                    placeholder='Email address'
                    className='social__modal__input'
                    required={true}
                    type='email'
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                  />
                </div>
              )}

              {subscriptionProgress === 'done' && (
                <div className='social__modal__success'>
                  Congratulations ! You subscribed to the newsletter.{' '}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              {subscriptionProgress !== 'done' && (
                <Button
                  variant='contained'
                  className='social__modal__actions__button'
                  color='primary'
                  type='submit'
                  disabled={subscriptionProgress === 'progress'}
                >
                  OK
                </Button>
              )}
              <Button
                onClick={e => {
                  setModalIsOpen(false);
                  document.removeEventListener('mouseout', handleMouseOut);
                }}
                variant='text'
              >
                {subscriptionProgress === 'done' ? 'Close' : 'No, thank you'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Snackbar
          open={snackbarIsOpen}
          message={message}
          autoHideDuration={4000}
          onClose={e => setSnackbarIsOpen(false)}
        />
      </div>
    </div>
  );
};

SocialMedia.propTypes = {
  pathname: PropTypes.string,
};

SocialMedia.defaultProps = {
  pathname: '/',
};

export default SocialMedia;
