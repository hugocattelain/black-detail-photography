import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Client from '../Client';
import { withRouter } from 'react-router';
import '../styles/content.scss';

class Contact extends Component {

  state = {
    mail:"",
    subject:"",
    message:"",
    messageSent: false,
  }
  contactUs = (event) => {
    event.preventDefault();
    const data = {
      from: this.state.mail,
      subject: this.state.subject,
      text: this.state.message,
    }
    console.log("send mail");
    Client.sendMessage(data, () => {
      this.setState({ messageSent: true })
    });
  }

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value});
  }

  onBlur(event, name) {
    if (event.target.value === ''){
      this.setState({ [name]: 'This field is required.' } );
    } else {
      this.setState({ errorText: '' });
    }
  }

  render(){
    const messageSent = this.state.messageSent;

    return(
      <div className="outer__container">
        <div className="container">
        {!messageSent ? (
          <div>
            <h1>
              Drop me a message if you want to shoot or just to say Hi !
            </h1>
            <form onSubmit={(e) => this.contactUs(e)}>
              <MuiThemeProvider>
                <TextField
                  id="subject"
                  hintText="Subject"
                  required
                  value={this.state.subject}
                  onChange={(e) => this.setInputState(e, 'subject')}
                  errorText={this.state.subjectError}
                  onBlur={(e) => this.onBlur(e, 'subjectError')}
                />
              </MuiThemeProvider>
              <MuiThemeProvider>
                <TextField
                  id="email"
                  type="email"
                  hintText="Your email address"
                  required
                  value={this.state.mail}
                  onChange={(e) => this.setInputState(e, 'mail')}
                  errorText={this.state.mailError}
                  onBlur={(e) => this.onBlur(e, 'mailError')}
                />
              </MuiThemeProvider>
              <MuiThemeProvider>
                <TextField
                  id="message"
                  hintText="Your message"
                  required
                  value={this.state.message}
                  onChange={(e) => this.setInputState(e, 'message')}
                  multiLine={true}
                  rows={5}
                  rowsMax={10}
                  errorText={this.state.messageError}
                  onBlur={(e) => this.onBlur(e, 'messageError')}
                />
              </MuiThemeProvider>
              <MuiThemeProvider>
                <RaisedButton
                  type="submit"
                  label="Send"
                />
              </MuiThemeProvider>
            </form>
          </div>
        ) : (
          <div>
            <h2>Thank you for your message.</h2>
            <h4>You will receive an answer as soon as possible.</h4>
            <MuiThemeProvider>
              <RaisedButton
                onClick={e => {this.props.history.push('/')}}
                label="Back to Home"
              />
            </MuiThemeProvider>
          </div>
        )}
        <a className="github-link" href="https://github.com/hugocattelain" target="_blank" rel="noopener noreferrer">
          <div className="github-link__logo"></div>
        </a>
        </div>
      </div>
    );
  }
}

export default withRouter(Contact);
