import React, { Component } from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';

import Client from '../../Client';
import {
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@material-ui/core';

class ManageEmail extends Component {
  state = {
    emails: [],
    snackbarIsOpen: false,
    message: '',
    checked: [],
    allChecked: false,
  };

  componentDidMount = () => {
    Client.getEmails().then(emails => {
      this.setState({
        emails: emails,
      });
    });
  };

  handleCheckAll = () => {
    const { allChecked, emails } = this.state;

    if (allChecked) {
      this.setState({ allChecked: false, checked: [] });
    } else {
      const newChecked = [];
      for (var i = 0; i < emails.length; i++) newChecked.push(i);
      this.setState({ allChecked: true, checked: newChecked });
    }
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleChange = email => event => {
    const { emails } = this.state;
    const index = emails.indexOf(email);
    const newEmails = [...emails];
    email.subscription_type = event.target.value;
    newEmails.slice(index, email);
    Client.updateEmail(email.email, email.subscription_type);
    this.setState({
      emails: newEmails,
    });
  };

  handleGroupChange = event => {
    const { emails, checked } = this.state;
    const value = event.target.value;
    const newEmails = [...emails];
    for (let i = 0; i < checked.length; i++) {
      const editedEmail = newEmails[checked[i]];
      editedEmail.subscription_type = value;
      Client.updateEmail(editedEmail.email, editedEmail.subscription_type);
      newEmails.slice(checked[i], editedEmail);
    }
    this.setState({
      emails: newEmails,
      snackbarIsOpen: true,
      message: 'Updated ' + checked.length + ' email(s).',
    });
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen: false });
  };

  getDate = date => {
    const formatedDate = new Date(date);
    return String(formatedDate);
  };

  render() {
    const { emails, snackbarIsOpen, message, checked, allChecked } = this.state;

    return (
      <div>
        <div className="admin__manage__actions">
          <FormControlLabel
            control={
              <Checkbox
                checked={allChecked}
                onChange={this.handleCheckAll}
                value="allChecked"
              />
            }
            label="Select all"
          />

          <FormControl
            style={{
              minWidth: '200px',
              display: 'flex',
              marginLeft: '40px',
              maxWidth: '250px',
            }}
          >
            <InputLabel htmlFor="subscription-type">
              Subscription type
            </InputLabel>
            <Select
              value=""
              onChange={this.handleGroupChange}
              inputProps={{
                name: 'subscription-type',
                id: 'subscription-type',
              }}
            >
              <MenuItem value="" />
              <MenuItem value={0}>No</MenuItem>
              <MenuItem value={1}>Subscribed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Divider />
        <List>
          {emails.map((email, index) => (
            <ListItem
              key={index}
              role={undefined}
              button
              onClick={this.handleToggle(index)}
            >
              <Checkbox
                checked={checked.indexOf(index) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText
                primary={email.email}
                secondary={this.getDate(email.reg_date)}
              />
              <ListItemSecondaryAction>
                <FormControl style={{ minWidth: '200px' }}>
                  <InputLabel htmlFor="subscription-type">
                    Subscription type
                  </InputLabel>
                  <Select
                    value={email.subscription_type}
                    onChange={this.handleChange(email)}
                    inputProps={{
                      name: 'subscription-type',
                      id: 'subscription-type',
                    }}
                  >
                    <MenuItem value={0}>No</MenuItem>
                    <MenuItem value={1}>Subscribed</MenuItem>
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

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

export default ManageEmail;
