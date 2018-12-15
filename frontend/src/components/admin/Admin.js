import React, { Component } from 'react';
import UploadPhoto from './UploadPhoto';
import ManagePhoto from './ManagePhoto';
import Client from '../../Client';

import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import './admin.css';
import { AppBar, Tabs, Tab, Typography, Button } from '@material-ui/core';

const categories = [
  { name: '', tag: '' },
  { name: 'Architecture', tag: 'architecture' },
  { name: 'Portrait', tag: 'portrait' },
  { name: 'Nude', tag: 'nsfw' },
];

class Admin extends Component {
  state = {
    password: '',
    tab: 1,
    isAdmin: false,
    snackbarIsOpen: false,
    message: '',
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
        this.setState({
          isAdmin: true,
        });
      })
      .catch(err => {
        this.setState({
          snackbarIsOpen: true,
          message: 'Wrong password',
        });
      });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab: tab });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen: false });
  };

  render() {
    const { tab, isAdmin } = this.state;
    return (
      <div className="admin">
        {isAdmin ? (
          <div className="admin__container admin__container--top">
            <AppBar position="static">
              <Tabs value={tab} onChange={this.handleTabChange}>
                <Tab label="Upload" />
                <Tab label="Manage" />
              </Tabs>
            </AppBar>

            {tab === 0 && (
              <Typography component="div" className="admin__section">
                <UploadPhoto categories={categories} />
              </Typography>
            )}
            {tab === 1 && (
              <Typography component="div" className="admin__section">
                <ManagePhoto categories={categories} />
              </Typography>
            )}
          </div>
        ) : (
          <div className="admin__container">
            <TextField
              className="admin__login-input"
              label="Password"
              type="password"
              required={true}
              value={this.state.adminPassword}
              onChange={this.setInputState('password')}
            />
            <Button
              className="admin__login-button"
              variant="contained"
              color="primary"
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
