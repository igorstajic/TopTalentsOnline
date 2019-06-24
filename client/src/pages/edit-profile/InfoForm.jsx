//@flow
import React, { useState, useEffect, useCallback, useContext, useReducer } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { SessionContext, clearSession } from '../../services/session';
import SelectControl from '../../components/SelectControl';

import categories from '../../data/categories';
import subCategories from '../../data/subcategories';
import axios from '../../configs/axios';

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  tabContent: {
    padding: theme.spacing(3, 2),
  },
  tabBar: {
    width: '100%',
  },
  tabItem: {
    flex: 1,
  },
  categoriesContainer: {
    paddingTop: theme.spacing(4),
  },
  deleteActionContainer: {
    paddingTop: theme.spacing(4),
  },
}));

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

type StateType = {
  profile: {
    firstName: string,
    lastName: string,
    email: string,
    city: string,
    country: string,
    category: string,
    subCategories: Array<string>,
  },
  inputErrors: {
    firstName: string,
    lastName: string,
    email: string,
  },
  isLoading: boolean,
  isShowingDeleteDialog: boolean,
};

const initialState: StateType = {
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: '',
    category: '',
    subCategories: [],
  },
  inputErrors: {
    firstName: '',
    lastName: '',
    email: '',
  },
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

    default:
      throw new Error();
  }
}

function InfoForm({ enqueueSnackbar, profileData }: { profileData: Object, enqueueSnackbar: Function }) {
  const classes = useStyles();
  const session = useContext(SessionContext);

  const [state, dispatch]: [StateType, (ActionType) => void] = useReducer(reducer, initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateInputs = useCallback(() => {
    const isFieldValid = fieldName => state.profile[fieldName].trim().length > 0;
    dispatch({
      type: actions.UPDATE_INPUT_ERRORS,
      payload: {
        firstName: !isFieldValid('firstName') ? 'First name is required' : '',
        lastName: !isFieldValid('lastName') ? 'Last name is required' : '',
        email: !isFieldValid('email') ? 'Email name is required' : '',
      },
    });

    return isFieldValid('firstName') && isFieldValid('lastName') && isFieldValid('email');
  }, [state.profile]);

  useEffect(() => {
    if (isSubmitted) {
      validateInputs();
    }
  }, [isSubmitted, validateInputs]);

  useEffect(() => {
    dispatch({
      type: actions.UPDATE_PROFILE,
      payload: {
        ...profileData,
      },
    });
  }, [profileData]);

  const onSubmit = async event => {
    setIsSubmitted(true);
    event.preventDefault();

    if (validateInputs()) {
      try {
        await axios.put(`/users/${profileData.id}`, {
          ...state.profile,
        });
        enqueueSnackbar('Profile information updated.', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.response.data.details || 'Something went wrong!', { variant: 'error' });
      }
    }
  };

  const handleOnChange = ({ target: { value, name } }) => {
    dispatch({
      type: actions.UPDATE_PROFILE,
      payload: {
        [name]: value,
      },
    });
  };

  const handleDeleteProfile = () => {
    session.setCurrentUser(null);
    clearSession();
  };

  return (
    <>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              error={state.inputErrors.firstName.length > 0}
              helperText={state.inputErrors.firstName}
              value={state.profile.firstName}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              error={state.inputErrors.lastName.length > 0}
              helperText={state.inputErrors.lastName}
              value={state.profile.lastName}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              error={state.inputErrors.email.length > 0}
              helperText={state.inputErrors.email}
              value={state.profile.email}
              onChange={handleOnChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth id="city" label="City" name="city" value={state.profile.city} onChange={handleOnChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth id="country" label="Country" name="country" value={state.profile.country} onChange={handleOnChange} />
          </Grid>
        </Grid>

        <Grid container spacing={2} className={classes.categoriesContainer}>
          <Grid item xs={12}>
            <SelectControl
              options={categories}
              label="Category"
              placeholder="Choose..."
              value={state.profile.category}
              onSelect={selected => 
                dispatch({
                  type: actions.UPDATE_PROFILE,
                  payload: {
                    category: selected,
                  },
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <SelectControl
              options={subCategories}
              label="Skills"
              isMulty
              placeholder="Add..."
              value={state.profile.subCategories}
              onSelect={selected =>
                dispatch({
                  type: actions.UPDATE_PROFILE,
                  payload: {
                    subCategories: selected,
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
      <Grid className={classes.deleteActionContainer} container justify="flex-end">
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
              <DialogContentText id="alert-dialog-description">{`Are you sure? This operation can't be undone!`}</DialogContentText>
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
    </>
  );
}

export default withSnackbar(InfoForm);
