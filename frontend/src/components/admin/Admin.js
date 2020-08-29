// Libraries
import React, { Component } from 'react';
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

class Admin extends Component {
  state = {
    password: '',
    tab: 1,
    isAdmin: false,
    snackbarIsOpen: false,
    message: '',
    lastIndex: 0,
  };

  componentWillUnmount = () => {
    sessionStorage.removeItem('bearer');
  };

  setInputState = name => event => {
    this.setState({ [name]: event.target.value });
  };

  login = () => {
    const data = {
      username: process.env.REACT_APP_ADMIN_USER,
      password: this.state.password,
    };
    Client.login(data)
      .then(response => {
        sessionStorage.setItem('bearer', response.token);
        Client.getImages(param, images => {
          images.forEach(image => {
            image.edit = false;
          });
          this.setState({
            images: images,
            isAdmin: true,
            lastIndex: this.getLastIndex(images),
          });
        });
      })
      .catch(err => {
        this.setState({
          snackbarIsOpen: true,
          message: 'Wrong password',
        });
      });
  };

  getLastIndex = images => {
    const index = Math.max.apply(
      Math,
      images.map(function(o) {
        return o.image_index;
      })
    );
    return index;
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab: tab });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen: false });
  };

  render() {
    const { tab, isAdmin, images, lastIndex } = this.state;
    return (
      <div className='container'>
        {isAdmin ? (
          <div className='admin__container admin__container--top'>
            <AppBar position='static'>
              <Tabs value={tab} onChange={this.handleTabChange}>
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
              value={this.state.adminPassword}
              onChange={this.setInputState('password')}
            />
            <Button
              className='admin__login-button'
              variant='contained'
              color='primary'
              onClick={this.login}
            >
              Login
            </Button>
            <Snackbar
              open={this.state.snackbarIsOpen}
              message={this.state.message}
              autoHideDuration={4000}
              onClose={this.handleSnackbarClose}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Admin;
