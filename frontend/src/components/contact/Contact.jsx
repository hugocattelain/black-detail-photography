// Libraries
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Client from '../../Client';

// UI Components
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const Contact = ({ history }) => {
  const [mail, setMail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState('no');

  const contactUs = event => {
    event.preventDefault();
    setMessageSent('progress');
    const message_data = {
      from: mail,
      subject: subject,
      text: message,
    };

    Client.sendMessage(message_data, () => {
      setMessageSent('sent');
    });
  };

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

            <form onSubmit={e => contactUs(e)}>
              <TextField
                id='subject'
                type='text'
                label='Subject'
                required
                className='contact__input-subject'
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />

              <TextField
                id='email'
                type='email'
                label='Email'
                required
                className='contact__input-email'
                value={mail}
                onChange={e => setMail(e.target.value)}
              />
              <TextField
                id='message'
                label='Message'
                required
                className='contact__input-message'
                value={message}
                onChange={e => setMessage(e.target.value)}
                multiline
                rows='4'
                rowsMax='10'
              />
              <Button
                variant='contained'
                type='submit'
                color='primary'
                className='contact__button'
                disabled={messageSent === 'progress'}
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
              history.push('/');
            }}
            className='contact__button'
          >
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default withRouter(Contact);
