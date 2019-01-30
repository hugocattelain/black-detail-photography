import React, { Component } from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import Client from '../../Client';
import {
  TextField,
  Button,
  CardActions,
  CardContent,
  Card,
  CardHeader,
  withStyles,
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

class Newsletter extends Component {
  state = {
    emails: [],
    snackbarIsOpen: false,
    message: '',
    subject: '',
    title: '',
    subtitle: '',
    body: '',
    link_ref: '',
    link_text: '',
  };

  componentDidMount = () => {
    Client.getEmails().then(emails => {
      this.setState({
        emails: emails,
      });
    });
  };

  sendNewsletter = event => {
    event.preventDefault();
    const data = {
      emails: this.state.emails,
      subject: this.state.subject,
      title: this.state.title,
      subtitle: this.state.subtitle,
      body: this.state.body,
      link_ref: this.state.link_ref,
      link_text: this.state.link_text,
    };
    Client.postCustomNewsletter(data)
      .then(res => {
        this.setState({
          snackbarIsOpen: true,
          message: 'Newsletter sent !',
        });
      })
      .catch(err => {
        this.setState({
          snackbarIsOpen: true,
          message: 'Error: ' + err,
        });
      });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen: false });
  };

  setInputState = name => event => {
    this.setState({ [name]: event.target.value });
  };

  getDate = date => {
    const formatedDate = new Date(date);
    return String(formatedDate);
  };

  render() {
    const {
      snackbarIsOpen,
      message,
      subject,
      title,
      subtitle,
      body,
      link_ref,
      link_text,
    } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <form onSubmit={this.sendNewsletter}>
          <Card className={classes.card}>
            <CardHeader title="Newsletter" className={classes.title} />
            <CardContent>
              <TextField
                id="subject"
                label="Subject"
                value={subject}
                fullWidth
                required
                onChange={this.setInputState('subject')}
              />
              <TextField
                id="title"
                label="Title"
                value={title}
                fullWidth
                required
                onChange={this.setInputState('title')}
              />
              <TextField
                id="subtitle"
                label="Subtitle"
                value={subtitle}
                fullWidth
                onChange={this.setInputState('subtitle')}
              />
              <TextField
                id="body"
                label="Body"
                value={body}
                fullWidth
                required
                onChange={this.setInputState('body')}
                multiline
                rows="5"
                rowsMax="10"
              />
              <TextField
                id="link_text"
                label="Link text"
                value={link_text}
                fullWidth
                onChange={this.setInputState('link_text')}
              />
              <TextField
                id="link_ref"
                label="Link address"
                value={link_ref}
                fullWidth
                onChange={this.setInputState('link_ref')}
              />
            </CardContent>
            <CardActions>
              <Button
                className={classes.button}
                variant="contained"
                type="submit"
                color="primary"
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
          onClose={this.handleSnackbarClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Newsletter);
