import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Client from '../Client';
import $ from "jquery";
import { withRouter } from 'react-router';

import '../styles/content.css';

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

class Contact extends Component {

  state = {
    mail:"",
    subject:"",
    message:"",
    messageSent: 'no',
  }

  componentWillMount = () => {
      $('body').addClass('no-overflow');
      $(".hamburger").removeClass("gone");
      $(".mini-navbar").removeClass("gone");

  }

  componentWillUnmount = () => {
      $('body').removeClass('no-overflow');
  }

  contactUs = (event) => {
    event.preventDefault();
    this.setState({ messageSent: 'progress' })
    const message_data = {
      from: this.state.mail,
      subject: this.state.subject,
      text: this.state.message,
    };
    const email_data = {
      email: this.state.mail,
      subscription_type: 1
    };

    Client.sendMessage(message_data, () => {
      this.setState({ messageSent: 'sent' });
    });
    Client.postEmail(email_data, () => {});
  }


  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value});
  }

  onBlur(event, name) {
    if (event.target.value === ''){
      this.setState({ [name]: 'This field is required.' } );
    } else {
      this.setState({ [name]: '' });
    }
  }

  render(){
    const messageSent = this.state.messageSent;

    return(
      <div className="container contact">
      {messageSent !== 'sent'? (
        <div>
          <MuiThemeProvider>
            <Paper zDepth={3} className="contact__wrapper global__center">
              <div className="col-sm-4 col-xs-3">
                <hr className="global__divider" />
              </div>
              <div className="col-sm-4 col-xs-6">
                <h1 className="contact__title">
                  Contact
                </h1>
              </div>
              <div className="col-sm-4 col-xs-3">
                <hr className="global__divider" />
              </div>
              <h2 className="contact__subtitle">Drop me a message if you want to shoot or just to say Hi !</h2>

              <form onSubmit={(e) => this.contactUs(e)}>
                <MuiThemeProvider muiTheme={muiBlack}>
                  <TextField
                    id="subject"
                    hintText="Subject"
                    required
                    className="contact__input-subject"
                    value={this.state.subject}
                    onChange={(e) => this.setInputState(e, 'subject')}
                    errorText={this.state.subjectError}
                    onBlur={(e) => this.onBlur(e, 'subjectError')}
                  />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiBlack}>
                  <TextField
                    id="email"
                    type="email"
                    hintText="Email"
                    required
                    className="contact__input-email"
                    value={this.state.mail}
                    onChange={(e) => this.setInputState(e, 'mail')}
                    errorText={this.state.mailError}
                    onBlur={(e) => this.onBlur(e, 'mailError')}
                  />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiBlack}>
                  <TextField
                    id="message"
                    hintText="Message"
                    required
                    className="contact__input-message"
                    value={this.state.message}
                    onChange={(e) => this.setInputState(e, 'message')}
                    multiLine={true}
                    rows={5}
                    rowsMax={10}
                    errorText={this.state.messageError}
                    onBlur={(e) => this.onBlur(e, 'messageError')}
                  />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiBlack}>
                  <RaisedButton
                    type="submit"
                    label="Send"
                    primary={true}
                    className="contact__button"
                    disabled={this.state.messageSent === 'progress'}
                  />
                </MuiThemeProvider>
              </form>
              {messageSent === 'progress' && (
                <MuiThemeProvider muiTheme={muiBlack}>
                  <CircularProgress size={30} thickness={2} />
                </MuiThemeProvider>
              )}
            </Paper>
          </MuiThemeProvider>
        </div>
      ) : (
        <div className="contact__wrapper global__center">
          <h1 className="contact__title">Thank you for your message.</h1>
          <h4 className="contact__subtitle">You will receive an answer as soon as possible.</h4>
          <MuiThemeProvider muiTheme={muiBlack}>
            <RaisedButton
              onClick={e => {this.props.history.push('/')}}
              label="Back to Home"
              className="contact__button"
            />
          </MuiThemeProvider>
        </div>
      )}
      </div>
    );
  }
}

export default withRouter(Contact);
