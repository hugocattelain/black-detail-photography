import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Paper from '@material-ui/core/Paper';
import Client from '../../Client';
import { withRouter } from 'react-router-dom';

import '../../styles/content.css';
import { FormControlLabel } from '@material-ui/core';

const muiBlack = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#616161',
    },
  },
});

class EmailPreferences extends Component {
  state = {
    email: this.props.match.params.email,
    subscriptionType: this.props.match.params.subscriptionType,
    loading: false,
    status: 'todo',
  };

  setInputState = event => {
    this.setState({ subscriptionType: event.target.value });
  };

  savePreferences = event => {
    event.preventDefault();
    const email = this.state.email;
    const pref = this.state.subscriptionType;
    this.setState({ loading: true });
    Client.updateEmail(email, pref)
      .then(res => {
        this.setState({
          status: 'done',
          loading: false,
        });
      })
      .catch(err => {
        this.setState({
          status: 'todo',
          loading: false,
        });
      });
  };
  render() {
    const { subscriptionType, status, loading } = this.state;
    return (
      <div className="container preferences">
        {status === 'todo' ? (
          <MuiThemeProvider theme={muiBlack}>
            <Paper
              elevation={3}
              className="preferences__wrapper global__center"
            >
              <div>
                <div className="row">
                  <div className="col-xs-3">
                    <hr className="global__divider" />
                  </div>
                  <div className="col-xs-6">
                    <h1 className="preferences__title">Notifications</h1>
                  </div>
                  <div className="col-xs-3">
                    <hr className="global__divider" />
                  </div>
                </div>
                <h2 className="preferences__subtitle">
                  I want to get notified :
                </h2>
                <form onSubmit={e => this.savePreferences(e)}>
                  <MuiThemeProvider theme={muiBlack}>
                    <RadioGroup
                      name="subscriptionType"
                      value={String(subscriptionType)}
                      onChange={this.setInputState}
                      className="preferences__radio-group"
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio color="primary" />}
                        label="For every new photo coming up"
                      />
                      <FormControlLabel
                        value="4"
                        control={<Radio color="primary" />}
                        label="Only for important updates about Black Detail"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio color="primary" />}
                        label="Never"
                      />
                    </RadioGroup>
                  </MuiThemeProvider>
                  <MuiThemeProvider theme={muiBlack}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      color="primary"
                      className="preferences__button"
                    >
                      OK
                    </Button>
                  </MuiThemeProvider>
                </form>
                {loading && (
                  <MuiThemeProvider theme={muiBlack}>
                    <CircularProgress size={30} thickness={2} />
                  </MuiThemeProvider>
                )}
              </div>
            </Paper>
          </MuiThemeProvider>
        ) : (
          <MuiThemeProvider theme={muiBlack}>
            <Paper
              elevation={3}
              className="preferences__wrapper global__center"
            >
              <div>
                <h2 className="preferences__subtitle">
                  Your notification preferences have been updated.
                </h2>
                <MuiThemeProvider theme={muiBlack}>
                  <Button
                    variant="contained"
                    onClick={e => {
                      this.props.history.push('/');
                    }}
                    className="preferences__button"
                  >
                    Back to Home
                  </Button>
                </MuiThemeProvider>
              </div>
            </Paper>
          </MuiThemeProvider>
        )}
      </div>
    );
  }
}

export default withRouter(EmailPreferences);
