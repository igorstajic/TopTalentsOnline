//@flow
import React, { useState, useEffect, useCallback, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import { withSnackbar } from 'notistack';

import RouterLink from '../components/RouterLink';

import { SessionContext, authenticateSession } from '../helpers/session';
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login({ enqueueSnackbar }: { enqueueSnackbar: Function }) {
  const classes = useStyles();
  const session = useContext(SessionContext);

  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateInputs = useCallback(() => {
    let isValid = false;
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
  }, [email, password]);

  useEffect(() => {
    if (isSubmitted) {
      validateInputs();
    }
  }, [isSubmitted, validateInputs]);

  const onSubmit = async event => {
    setIsSubmitted(true);
    event.preventDefault();

    if (validateInputs()) {
      const authenticationResponse = await authenticateSession(email, password);
      if (authenticationResponse.user) {
        session.setCurrentUser(authenticationResponse.user);
      } else {
        enqueueSnackbar(authenticationResponse.error, { variant: 'error' });
      }
    }
  };

  return (
    <Fade in={true}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              type="email"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={emailErrorMessage.length > 0}
              helperText={emailErrorMessage}
              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              error={passwordErrorMessage.length > 0}
              helperText={passwordErrorMessage}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Fade>
  );
}

export default withSnackbar(Login);
