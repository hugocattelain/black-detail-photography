// Libraries
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

// Components
import Client from '../../Client';

// UI Components
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormControlLabel } from '@material-ui/core';

const EmailPreferences = ({ history, match }) => {
  const email = match.params.email;
  const [subscriptionType, setSubscriptionType] = useState(
    match.params.subscriptionType
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('todo');

  const savePreferences = event => {
    event.preventDefault();
    setLoading(true);
    Client.updateEmail(email, subscriptionType)
      .then(res => {
        setStatus('done');
        setLoading(false);
      })
      .catch(err => {
        setStatus('todo');
        setLoading(false);
      });
  };

  return (
    <div className='container preferences'>
      {status === 'todo' ? (
        <Paper elevation={3} className='preferences__wrapper global__center'>
          <div>
            <div className='row'>
              <div className='col-xs-3'>
                <hr className='global__divider' />
              </div>
              <div className='col-xs-6'>
                <h1 className='preferences__title'>Notifications</h1>
              </div>
              <div className='col-xs-3'>
                <hr className='global__divider' />
              </div>
            </div>
            <h2 className='preferences__subtitle'>I want to get notified :</h2>
            <form onSubmit={e => savePreferences(e)}>
              <RadioGroup
                name='subscriptionType'
                value={String(subscriptionType)}
                onChange={e => setSubscriptionType(e.target.value)}
                className='preferences__radio-group'
              >
                <FormControlLabel
                  value='1'
                  control={<Radio color='primary' />}
                  label='For every new photo coming up'
                />
                <FormControlLabel
                  value='4'
                  control={<Radio color='primary' />}
                  label='Only for important updates about Black Detail'
                />
                <FormControlLabel
                  value='0'
                  control={<Radio color='primary' />}
                  label='Never'
                />
              </RadioGroup>
              <Button
                variant='contained'
                type='submit'
                disabled={loading}
                color='primary'
                className='preferences__button'
              >
                OK
              </Button>
            </form>
            {loading && <CircularProgress size={30} thickness={2} />}
          </div>
        </Paper>
      ) : (
        <Paper elevation={3} className='preferences__wrapper global__center'>
          <div>
            <h2 className='preferences__subtitle'>
              Your notification preferences have been updated.
            </h2>
            <Button
              variant='contained'
              onClick={e => {
                history.push('/');
              }}
              className='preferences__button'
            >
              Back to Home
            </Button>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default withRouter(EmailPreferences);
