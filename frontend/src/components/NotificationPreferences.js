import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Paper from 'material-ui/Paper';
import Client from '../Client';
import { withRouter } from 'react-router';
import '../styles/content.scss';

const muiBlack = getMuiTheme({
  "palette": {
    "primary1Color": "#212121",
    "primary2Color": "#616161",
    "accent1Color": "rgba(117, 117, 117, 0.51)",
    "pickerHeaderColor": "#212121"
  },
  "textField": {
    "errorColor": "#f44336"
  },
  "borderRadius": 2
});

class NotificationPreferences extends Component {

  state = {
    email:this.props.match.params.email,
    subscriptionType: this.props.match.params.subscriptionType,
    loading: false,
    status: 'todo',
  }

  setInputState = (name, value) => {
    this.setState({ [name]: value });
  }

  savePreferences = (event) => {
    event.preventDefault();
    const email = this.state.email;
    const pref = this.state.subscriptionType;
    this.setState({ loading: true });
    Client.updateEmail(email, pref)
    .then((res) => {
      this.setState({
        status: 'done',
        loading: false,
      });
    })
    .catch((err) => {
      this.setState({
        status: 'todo',
        loading: false,
      });
    });
  }
  render(){
    const loading = this.state.loading;
    const status = this.state.status;
    return(
      <div className="container preferences">
        {status === 'todo' ? (
          <MuiThemeProvider muiTheme={muiBlack}>
          <Paper zDepth={3} className="preferences__wrapper global__center">
          <div>
            <div className="row">
              <div className="col-sm-4 col-xs-3">
                <hr className="global__divider" />
              </div>
              <div className="col-sm-4 col-xs-6">
                <h1 className="preferences__title">
                  Notifications
                </h1>
              </div>
              <div className="col-sm-4 col-xs-3">
                <hr className="global__divider" />
              </div>
            </div>
            <h2 className="preferences__subtitle">I want to get notified :</h2>
            <form onSubmit={(e) => this.savePreferences(e)}>
              <MuiThemeProvider muiTheme={muiBlack}>
                <RadioButtonGroup
                  name="subscriptionType"
                  defaultSelected={String(this.state.subscriptionType)}
                  onChange={(evt, value) => this.setInputState('subscriptionType', value)}
                  className="preferences__radio-group"
                >
                  <RadioButton
                    value="1"
                    label="For every new photo coming up"
                  />
                  <RadioButton
                    value="2"
                    label="Once a week"
                  />
                  <RadioButton
                    value="3"
                    label="Once a month"
                  />
                  <RadioButton
                    value="4"
                    label="Only for important updates about Black Detail"
                  />
                  <RadioButton
                    value="0"
                    label="Never"
                  />
                </RadioButtonGroup>
              </MuiThemeProvider>
              <MuiThemeProvider muiTheme={muiBlack}>
                <RaisedButton
                  type="submit"
                  label="OK"
                  disabled={loading}
                  primary={true}
                  className="preferences__button"
                />
              </MuiThemeProvider>
            </form>
            {loading && (
              <MuiThemeProvider muiTheme={muiBlack}>
                <CircularProgress size={30} thickness={2} />
              </MuiThemeProvider>
            )}
          </div>
          </Paper>
          </MuiThemeProvider>
        ) : (
          <MuiThemeProvider muiTheme={muiBlack}>
          <Paper zDepth={3} className="preferences__wrapper global__center">
          <div>
            <h2 className="preferences__subtitle">Your notification preferences have been updated.</h2>
            <MuiThemeProvider muiTheme={muiBlack}>
              <RaisedButton
                onClick={e => {this.props.history.push('/')}}
                label="Back to Home"
                className="preferences__button"
              />
            </MuiThemeProvider>
          </div>
          </Paper>
          </MuiThemeProvider>
        )}
      </div>
    );
  }
}

export default withRouter(NotificationPreferences);
