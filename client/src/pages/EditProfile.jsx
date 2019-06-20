//@flow
import React, { useState, useEffect, useCallback, useContext, useReducer } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import { withSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AccountIcon from '@material-ui/icons/AccountCircle';

import axios from '../configs/axios';
import { SessionContext, clearSession } from '../helpers/session';

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
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type StateType = {
  profile: {
    firstName: string,
    lastName: string,
    email: string,
  },
  inputErrors: {
    firstName: string,
    lastName: string,
    email: string,
  },
  isLoading: boolean,
  isShowingDeleteDialog: boolean,
};

const actions = {
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  UPDATE_INPUT_ERRORS: 'UPDATE_INPUT_ERRORS',
  TOGGLE_DELETE_DIALOG: 'TOGGLE_DELETE_DIALOG',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
};

type ActionType = {
  payload?: any,
  type: 'UPDATE_PROFILE' | 'UPDATE_INPUT_ERRORS' | 'TOGGLE_DELETE_DIALOG' | 'TOGGLE_LOADING',
};

const initialState: StateType = {
  inputErrors: {
    firstName: '',
    lastName: '',
    email: '',
  },
  profile: {},

  isShowingDeleteDialog: false,
  isLoading: true,
};
function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_INPUT_ERRORS':
      return { ...state, inputErrors: { ...state.inputErrors, ...action.payload } };
    case 'TOGGLE_DELETE_DIALOG':
      return { ...state, isShowingDeleteDialog: !state.isShowingDeleteDialog };
    case 'TOGGLE_LOADING':
      return { ...state, isLoading: !state.isLoading };
    default:
      throw new Error();
  }
}

function EditProfile({ enqueueSnackbar }: { history: Object, enqueueSnackbar: Function }) {
  const classes = useStyles();
  const session = useContext(SessionContext);

  const [state, dispatch]: [StateType, (ActionType) => void] = useReducer(reducer, initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateInputs = useCallback(() => {
    let isValid = true;
    dispatch({
      type: actions.UPDATE_INPUT_ERRORS,
      payload: {
        firstName: state.profile.firstName.trim().length === 0 ? 'First name is required' : '',
        lastName: state.profile.lastName.trim().length === 0 ? 'Last name is required' : '',
        email: state.profile.email.trim().length === 0 ? 'Email name is required' : '',
      },
    });
    Object.keys(state.profile).forEach(key => {
      if (state.profile[key].trim().length === 0) {
        isValid = false;
      }
    });
    return isValid;
  }, [state.profile]);

  useEffect(() => {
    if (isSubmitted) {
      validateInputs();
    }
  }, [isSubmitted, validateInputs]);

  const onSubmit = async event => {
    setIsSubmitted(true);
    event.preventDefault();

    if (validateInputs()) {
      enqueueSnackbar('Profile information updated.', { variant: 'success' });
      //   try {
      //     await axios.post('/users/register', {
      //       email,
      //       password,
      //       firstName,
      //       lastName,
      //     });
      //     const authenticationResponse = await authenticateSession(email, password);
      //     if (authenticationResponse.user) {
      //       session.setCurrentUser(authenticationResponse.user);
      //       history.push('/edit-profile');
      //     } else {
      //       enqueueSnackbar(authenticationResponse.error, { variant: 'error' });
      //     }
      //     enqueueSnackbar('Welcome to TopTalents Online', { variant: 'success' });
      //   } catch (error) {
      //     enqueueSnackbar(error.response.data.details || 'Something went wrong!', { variant: 'error' });
      //   }
    }
  };

  const handleDeleteProfile = () => {
    session.setCurrentUser(null);
    clearSession();
  };

  return (
    <Fade in={true}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AccountIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Profile
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
                  error={state.inputErrors.firstName.length > 0}
                  helperText={state.inputErrors.firstName}
                  value={state.profile.firstName}
                  onChange={ev =>
                    dispatch({
                      type: actions.UPDATE_PROFILE,
                      payload: {
                        firstName: ev.target.value,
                      },
                    })
                  }
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
                  error={state.inputErrors.lastName.length > 0}
                  helperText={state.inputErrors.lastName}
                  value={state.profile.lastName}
                  onChange={ev =>
                    dispatch({
                      type: actions.UPDATE_PROFILE,
                      payload: {
                        lastName: ev.target.value,
                      },
                    })
                  }
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
                  error={state.inputErrors.email.length > 0}
                  helperText={state.inputErrors.email}
                  value={state.profile.email}
                  onChange={ev =>
                    dispatch({
                      type: actions.UPDATE_PROFILE,
                      payload: {
                        email: ev.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Save Changes
            </Button>
          </form>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                onClick={() => dispatch({ type: actions.TOGGLE_DELETE_DIALOG })}
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Delete
              </Button>
              <Dialog
                open={state.isShowingDeleteDialog}
                onClose={() => dispatch({ type: actions.TOGGLE_DELETE_DIALOG })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Delete Account</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">Are you sure? This operation can not be undone!</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => dispatch({ type: actions.TOGGLE_DELETE_DIALOG })} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleDeleteProfile} color="primary" autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Fade>
  );
}

export default withSnackbar(EditProfile);
