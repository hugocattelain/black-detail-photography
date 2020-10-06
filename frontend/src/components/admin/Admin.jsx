// Libraries
import React, { useState } from 'react';
import UploadPhoto from './UploadPhoto';
import ManagePhoto from './ManagePhoto';

// Components
import Client from '../../Client';
import ManageEmail from './ManageEmail';
import Newsletter from './Newsletter';

// UI Components
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { AppBar, Tabs, Tab, Typography, Button } from '@material-ui/core';

// Styles
import './admin.scss';

const categories = [
  { name: '', tag: '' },
  { name: 'Architecture', tag: 'architecture' },
  { name: 'Portrait', tag: 'portrait' },
  { name: 'Nude', tag: 'nsfw' },
  /* { name: 'Editorial', tag: 'editorial' }, */
];
const param = 'all';

const Admin = () => {
  const [password, setPassword] = useState('w');
  const [tab, setTab] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [lastIndex, setLastIndex] = useState(0);
  const [images, setImages] = useState([]);

  const login = () => {
    const data = {
      username: process.env.REACT_APP_ADMIN_USER,
      password: password,
    };
    Client.login(data)
      .then(response => {
        sessionStorage.setItem('bearer', response.token);
        Client.getImages(param, images => {
          images.forEach(image => {
            image.edit = false;
          });
          setImages(images);
          setIsAdmin(true);
          setLastIndex(getLastIndex(images)); // ???
        });
      })
      .catch(err => {
        setSnackbarIsOpen(true);
        setMessage('Wrong password');
      });
  };

  const getLastIndex = images => {
    const index = Math.max.apply(
      Math,
      images.map(function(o) {
        return o.image_index;
      })
    );
    return index;
  };

  return (
    <div className='container'>
      {isAdmin ? (
        <div className='admin__container admin__container--top'>
          <AppBar position='static'>
            <Tabs value={tab} onChange={(e, tab) => setTab(tab)}>
              <Tab label='Upload' />
              <Tab label='Manage' />
              <Tab label='Mailing list' />
              <Tab label='New Email' />
            </Tabs>
          </AppBar>

          {tab === 0 && (
            <Typography component='div' className='admin__section'>
              <UploadPhoto categories={categories} lastIndex={lastIndex} />
            </Typography>
          )}
          {tab === 1 && (
            <Typography component='div' className='admin__section'>
              <ManagePhoto categories={categories} images={images} />
            </Typography>
          )}
          {tab === 2 && (
            <Typography component='div' className='admin__section'>
              <ManageEmail />
            </Typography>
          )}
          {tab === 3 && (
            <Typography component='div' className='admin__section'>
              <Newsletter />
            </Typography>
          )}
        </div>
      ) : (
        <div className='admin__container'>
          <TextField
            className='admin__login-input'
            label='Password'
            type='password'
            required={true}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            className='admin__login-button'
            variant='contained'
            color='primary'
            onClick={login}
          >
            Login
          </Button>
          <Snackbar
            open={snackbarIsOpen}
            message={message}
            autoHideDuration={4000}
            onClose={e => setSnackbarIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Admin;
