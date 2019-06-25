import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

import axios from '../configs/axios';
import { emailValidatior } from '../helpers/validators';

const useStyles = makeStyles(theme => ({
  message: {
    marginTop: theme.spacing(2),
  },
}));

function ContactFormDialog({ uid, isOpen, handleClose, enqueueSnackbar }) {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const [messageContent, setMessageContent] = useState('');
  const [messageContentErrorMessage, setMessageContentErrorMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateInputs = useCallback(() => {
    let isValid = false;
    if (email.trim().length === 0) {
      setEmailErrorMessage('Email is required');
    } else if (!emailValidatior.test(email)) {
      setEmailErrorMessage('Email is invalid');
    } else {
      setEmailErrorMessage('');
      isValid = true;
    }

    if (name.trim().length === 0) {
      setNameErrorMessage('Name is required');
      isValid = false;
    } else {
      setNameErrorMessage('');
    }

    if (messageContent.trim().length === 0) {
      setMessageContentErrorMessage('Message is required');
      isValid = false;
    } else {
      setMessageContentErrorMessage('');
    }

    return isValid;
  }, [email, name, messageContent]);

  useEffect(() => {
    if (isSubmitted) {
      validateInputs();
    }
  }, [isSubmitted, validateInputs]);
  const handleSendMessage = async () => {
    setIsSubmitted(true);

    if (validateInputs()) {
      try {
        await axios.post('/messages/send', {
          uid,
          from: email,
          contactName: name,
          message: messageContent,
        });
        enqueueSnackbar('Message sent!', { variant: 'success' });
        handleClose();
      } catch (error) {
        enqueueSnackbar(error.response.data.details || 'Something went wrong! Please try again later.', { variant: 'error' });
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Contact</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter your information and a short message.</DialogContentText>
        <TextField
          error={emailErrorMessage.length > 0}
          helperText={emailErrorMessage}
          autoFocus
          margin="dense"
          id="email"
          label="Your Email Address"
          type="email"
          fullWidth
          onChange={ev => setEmail(ev.target.value)}
        />
        <TextField
          error={nameErrorMessage.length > 0}
          helperText={nameErrorMessage}
          margin="dense"
          id="name"
          label="Your Name"
          type="text"
          fullWidth
          onChange={ev => setName(ev.target.value)}
        />
        <TextField
          className={classes.message}
          multiline
          margin="normal"
          rows="10"
          rowsMax="10"
          id="name"
          label="Message"
          variant="outlined"
          type="text"
          error={messageContentErrorMessage.length > 0}
          helperText={messageContentErrorMessage}
          fullWidth
          onChange={ev => setMessageContent(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSendMessage} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withSnackbar(ContactFormDialog);
