import React, { useState, useEffect, useCallback } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import RouterLink from '../components/RouterLink';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const [firstName, setFirstName] = useState('');
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateInputs = useCallback(() => {
    let isValid = false;
    if (firstName.trim().length === 0) {
      setFirstNameErrorMessage('Email is required');
    } else {
      setFirstNameErrorMessage('');
      isValid = true;
    }
    if (lastName.trim().length === 0) {
      setLastNameErrorMessage('Email is required');
    } else {
      setLastNameErrorMessage('');
      isValid = true;
    }
    if (email.trim().length === 0) {
      setEmailErrorMessage('Email is required');
    } else {
      setEmailErrorMessage('');
      isValid = true;
    }

    if (password.trim().length === 0) {
      setPasswordErrorMessage('Password is required');
      isValid = false;
    } else {
      setPasswordErrorMessage('');
    }

    return isValid;
  }, [email, firstName, lastName, password]);

  useEffect(() => {
    if (isSubmitted) {
      validateInputs();
    }
  }, [isSubmitted, validateInputs]);

  const onSubmit = event => {
    setIsSubmitted(true);
    event.preventDefault();

    if (validateInputs()) {
      console.log(`${email} : ${password}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={firstNameErrorMessage.length > 0}
                helperText={firstNameErrorMessage}
                value={firstName}
                onChange={ev => setFirstName(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={lastNameErrorMessage.length > 0}
                helperText={lastNameErrorMessage}
                value={lastName}
                onChange={ev => setLastName(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailErrorMessage.length > 0}
                helperText={emailErrorMessage}
                value={email}
                onChange={ev => setEmail(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={passwordErrorMessage.length > 0}
                helperText={passwordErrorMessage}
                value={password}
                onChange={ev => setPassword(ev.target.value)}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
