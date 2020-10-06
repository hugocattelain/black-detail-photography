// Libraries
import React, { useState, useEffect } from 'react';
import Client from '../../Client';

// UI Components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
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

const ManageEmail = () => {
  const [emails, setEmails] = useState([]);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [checked, setChecked] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    Client.getEmails().then(emails => {
      setEmails(emails);
    });
    return () => {};
  }, []);

  const handleCheckAll = () => {
    if (allChecked) {
      setAllChecked(false);
      setChecked([]);
    } else {
      const newChecked = [];
      for (var i = 0; i < emails.length; i++) {
        newChecked.push(i);
      }
      setAllChecked(true);
      setChecked(newChecked);
      setAllChecked(false);
      setChecked([]);
    }
  };

  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleChange = (event, email) => {
    const index = emails.indexOf(email);
    const newEmails = [...emails];
    email.subscription_type = event.target.value;
    newEmails.slice(index, email);
    Client.updateEmail(email.email, email.subscription_type);

    setEmails(newEmails);
    setMessage(`Updated 1 email`);
    setSnackbarIsOpen(true);
  };

  const handleGroupChange = event => {
    const value = event.target.value;
    const newEmails = [...emails];
    for (let i = 0; i < checked.length; i++) {
      const editedEmail = newEmails[checked[i]];
      editedEmail.subscription_type = value;
      Client.updateEmail(editedEmail.email, editedEmail.subscription_type);
      newEmails.slice(checked[i], editedEmail);
    }
    setEmails(newEmails);
    setMessage(`Updated ${checked.length} emails`);
    setSnackbarIsOpen(true);
  };

  const getDate = date => {
    const formatedDate = new Date(date);
    return String(formatedDate);
  };

  return (
    <div>
      <div className='admin__manage__actions'>
        <FormControlLabel
          control={
            <Checkbox
              checked={allChecked}
              onClick={e => handleCheckAll()}
              value='allChecked'
            />
          }
          label='Select all'
        />

        <FormControl
          style={{
            minWidth: '200px',
            display: 'flex',
            marginLeft: '40px',
            maxWidth: '250px',
          }}
        >
          <InputLabel htmlFor='subscription-type'>Subscription type</InputLabel>
          <Select
            value=''
            onChange={e => handleGroupChange(e)}
            inputProps={{
              name: 'subscription-type',
              id: 'subscription-type',
            }}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Partial</MenuItem>
            <MenuItem value={2}>All</MenuItem>
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
            onClick={e => handleToggle(index)}
          >
            <Checkbox
              checked={checked.indexOf(index) !== -1}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText
              primary={email.email}
              secondary={getDate(email.reg_date)}
            />
            <ListItemSecondaryAction>
              <FormControl style={{ minWidth: '200px' }}>
                <InputLabel htmlFor='subscription-type'>
                  Subscription type
                </InputLabel>
                <Select
                  value={email.subscription_type}
                  onChange={e => handleChange(e, email)}
                  inputProps={{
                    name: 'subscription-type',
                    id: 'subscription-type',
                  }}
                >
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={1}>Partial</MenuItem>
                  <MenuItem value={2}>All</MenuItem>
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
        onClose={e => setSnackbarIsOpen(false)}
      />
    </div>
  );
};

export default ManageEmail;
