// Libraries
import React, { useState, useEffect } from 'react';
import Client from '../../Client';

// UI Components
import Snackbar from '@material-ui/core/Snackbar';
import {
  TextField,
  Button,
  CardActions,
  CardContent,
  Card,
  CardHeader,
  withStyles,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

const styles = {
  card: {
    width: '50%',
    minWidth: 275,
    margin: '2rem auto',
  },
  title: {
    MuiTypography: {
      fontSize: '3rem',
    },
  },
  button: {
    margin: '0 auto',
  },
};

const Newsletter = ({ classes }) => {
  const [emails, setEmails] = useState([]);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');
  const [link_ref, setLink_ref] = useState('');
  const [link_text, setLink_text] = useState('');
  const [important, setImportant] = useState(false);

  useEffect(() => {
    Client.getEmails().then(emails => {
      setEmails(emails);
    });
    return () => {};
  }, []);

  const sendNewsletter = event => {
    event.preventDefault();
    const data = {
      emails: emails,
      subject: subject,
      title: title,
      subtitle: subtitle,
      body: body,
      link_ref: link_ref,
      link_text: link_text,
      important: important,
    };
    Client.postCustomNewsletter(data)
      .then(res => {
        setSnackbarIsOpen(true);
        setMessage('Newsletter sent !');
      })
      .catch(err => {
        setSnackbarIsOpen(true);
        setMessage('Error: ' + err);
      });
  };

  return (
    <div>
      <form onSubmit={e => sendNewsletter(e)}>
        <Card className={classes.card}>
          <CardHeader title='Newsletter' className={classes.title} />
          <CardContent>
            <TextField
              id='subject'
              label='Subject'
              value={subject}
              fullWidth
              required
              onChange={e => setSubject(e.target.value)}
            />
            <TextField
              id='title'
              label='Title'
              value={title}
              fullWidth
              required
              onChange={e => setTitle(e.target.value)}
            />
            <TextField
              id='subtitle'
              label='Subtitle'
              value={subtitle}
              fullWidth
              onChange={e => setSubtitle(e.target.value)}
            />
            <TextField
              id='body'
              label='Body'
              value={body}
              fullWidth
              required
              onChange={e => setBody(e.target.value)}
              multiline
              rows='5'
              rowsMax='10'
            />
            <TextField
              id='link_text'
              label='Link text'
              value={link_text}
              fullWidth
              onChange={e => setLink_text(e.target.value)}
            />
            <TextField
              id='link_ref'
              label='Link address'
              value={link_ref}
              fullWidth
              onChange={e => setLink_ref(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={important}
                  onChange={e => setImportant(!important)}
                  value={important}
                />
              }
              label='Important'
            />
          </CardContent>
          <CardActions>
            <Button
              className={classes.button}
              variant='contained'
              type='submit'
              color='primary'
            >
              Send
            </Button>
          </CardActions>
        </Card>
      </form>

      <Snackbar
        open={snackbarIsOpen}
        message={message}
        autoHideDuration={4000}
        onClose={e => setSnackbarIsOpen(false)}
      />
    </div>
  );
};

export default withStyles(styles)(Newsletter);
