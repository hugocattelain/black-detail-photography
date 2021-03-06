// Libraries
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Client from '../../Client';

// UI Components
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { FormHelperText } from '@material-ui/core';

class Contact extends Component {
  state = {
    mail: '',
    subject: '',
    message: '',
    messageSent: 'no',
  };

  contactUs = event => {
    event.preventDefault();
    this.setState({ messageSent: 'progress' });
    const message_data = {
      from: this.state.mail,
      subject: this.state.subject,
      text: this.state.message,
    };
    const email_data = {
      email: this.state.mail,
      subscription_type: 1,
    };

    Client.sendMessage(message_data, () => {
      this.setState({ messageSent: 'sent' });
    });
    Client.postEmail(email_data, () => {});
  };

  setInputState = (event, name) => {
    this.setState({ [name]: event.target.value });
  };

  onBlur(event, name) {
    if (event.target.value === '') {
      this.setState({ [name]: 'This field is required.' });
    } else {
      this.setState({ [name]: '' });
    }
  }

  render() {
    const messageSent = this.state.messageSent;

    return (
      <div className='contact__container'>
        {messageSent !== 'sent' ? (
          <div>
            <Paper elevation={3} className='contact__wrapper'>
              <div className='col-sm-4 col-xs-3'>
                <hr className='global__divider' />
              </div>
              <div className='col-sm-4 col-xs-6'>
                <h1 className='contact__title'>Contact</h1>
              </div>
              <div className='col-sm-4 col-xs-3'>
                <hr className='global__divider' />
              </div>
              <h2 className='contact__subtitle'>
                Drop me a message if you want to shoot or just to say Hi !
              </h2>

              <form onSubmit={e => this.contactUs(e)}>
                <TextField
                  id='subject'
                  label='Subject'
                  required
                  className='contact__input-subject'
                  value={this.state.subject}
                  onChange={e => this.setInputState(e, 'subject')}
                  onBlur={e => this.onBlur(e, 'subjectError')}
                />
                <FormHelperText id='subject-error-text'>
                  {this.state.subjectError}
                </FormHelperText>

                <TextField
                  id='email'
                  type='email'
                  label='Email'
                  required
                  className='contact__input-email'
                  value={this.state.mail}
                  onChange={e => this.setInputState(e, 'mail')}
                  onBlur={e => this.onBlur(e, 'mailError')}
                />
                <FormHelperText id='email-error-text'>
                  {this.state.mailError}
                </FormHelperText>
                <TextField
                  id='message'
                  label='Message'
                  required
                  className='contact__input-message'
                  value={this.state.message}
                  onChange={e => this.setInputState(e, 'message')}
                  multiline
                  rows='4'
                  rowsMax='10'
                  onBlur={e => this.onBlur(e, 'messageError')}
                />
                <FormHelperText id='message-error-text'>
                  {this.state.messageError}
                </FormHelperText>
                <Button
                  variant='contained'
                  type='submit'
                  color='primary'
                  className='contact__button'
                  disabled={this.state.messageSent === 'progress'}
                >
                  Send
                </Button>
              </form>
              {messageSent === 'progress' && (
                <CircularProgress size={30} thickness={2} />
              )}
            </Paper>
          </div>
        ) : (
          <div className='contact__wrapper'>
            <h1 className='contact__title'>Thank you for your message.</h1>
            <h4 className='contact__subtitle'>
              You will receive an answer as soon as possible.
            </h4>
            <Button
              variant='contained'
              onClick={e => {
                this.props.history.push('/');
              }}
              className='contact__button'
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Contact);
