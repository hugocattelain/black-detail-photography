import React, { Component } from 'react';
import Client from '../../Client';

import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import { FormControlLabel } from '@material-ui/core';

import './email-preferences.css';

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
      <div className="preferences__container ">
        {status === 'todo' ? (
          <Paper elevation={3} className="preferences__wrapper">
            <div>
              <div className="row">
                <div className="col-xs-1" />
                <div className="col-xs-10 preferences__title-wrapper">
                  <h1 className="preferences__title">Notifications</h1>
                </div>
                <div className="col-xs-1" />
              </div>
              <h2 className="preferences__subtitle">
                I want to get notified :
              </h2>
              <form onSubmit={e => this.savePreferences(e)}>
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
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  color="primary"
                  className="preferences__button"
                >
                  OK
                </Button>
              </form>
              {loading && <CircularProgress size={30} thickness={2} />}
            </div>
          </Paper>
        ) : (
          <Paper elevation={3} className="preferences__wrapper global__center">
            <div>
              <h2 className="preferences__subtitle">
                Your notification preferences have been updated.
              </h2>
              <Button
                variant="contained"
                onClick={e => {
                  this.props.history.push('/');
                }}
                className="preferences__button"
              >
                Back to Home
              </Button>
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

export default withRouter(EmailPreferences);
