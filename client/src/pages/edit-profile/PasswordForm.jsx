import React, { useEffect, useCallback, useReducer } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import axios from '../../configs/axios';

import Button from '@material-ui/core/Button';

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
}));

const initialState = {
  inputErrors: {
    oldPassword: '',
    newPassword: '',
    passwordConfirmation: '',
  },
  inputs: {
    oldPassword: '',
    newPassword: '',
    passwordConfirmation: '',
  },
  isSubmitted: false,
};

const actions = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_INPUT_ERRORS: 'UPDATE_INPUT_ERRORS',
  SET_SUBMITTED: 'SET_SUBMITTED',
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, inputs: { ...state.inputs, ...action.payload } };
    case 'UPDATE_INPUT_ERRORS':
      return { ...state, inputErrors: { ...state.inputErrors, ...action.payload } };
    case 'SET_SUBMITTED': {
      return { ...state, isSubmitted: action.payload || false };
    }
    default:
      throw new Error();
  }
}

function PasswordForm({ enqueueSnackbar, uid }) {
  const classes = useStyles();

  const [state, dispatch] = useReducer(reducer, initialState);

  const validateInputs = useCallback(() => {
    const isFieldValid = fieldName => state.inputs[fieldName].trim().length > 0;
    dispatch({
      type: actions.UPDATE_INPUT_ERRORS,
      payload: {
        oldPassword: !isFieldValid('oldPassword') ? "Old password can't be blank" : '',
        newPassword: !isFieldValid('newPassword') ? "New password can't be blank" : '',
        passwordConfirmation: state.inputs.newPassword !== state.inputs.passwordConfirmation ? 'Passwords must match' : '',
      },
    });

    return isFieldValid('oldPassword') && isFieldValid('newPassword') && state.inputs.newPassword === state.inputs.passwordConfirmation;
  }, [state.inputs]);

  useEffect(() => {
    if (state.isSubmitted) {
      validateInputs();
    }
  }, [state.isSubmitted, validateInputs]);

  const handleOnChange = ({ target: { value, name } }) => {
    dispatch({
      type: actions.UPDATE_FIELD,
      payload: {
        [name]: value,
      },
    });
  };

  const onSubmit = async event => {
    dispatch({ type: actions.SET_SUBMITTED, payload: true });
    event.preventDefault();

    if (validateInputs()) {
      const { newPassword, oldPassword } = state.inputs;
      try {
        const apiPath = location.pathname.includes('/admin/edit-profile/')
          ? `/auth/admin/change-user-password/${uid}`
          : '/auth/change-password';

        await axios.post(apiPath, {
          newPassword,
          oldPassword,
        });
        enqueueSnackbar('Password updated.', { variant: 'success' });
        dispatch({ type: actions.SET_SUBMITTED, payload: false });
        dispatch({
          type: actions.UPDATE_FIELD,
          payload: {
            oldPassword: '',
            newPassword: '',
            passwordConfirmation: '',
          },
        });
      } catch (error) {
        enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
      }
    }
  };
  return (
    <form className={classes.form} noValidate onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            autoFocus
            fullWidth
            autoComplete="off"
            type="password"
            id="old_password"
            label="Old Password"
            name="oldPassword"
            error={state.inputErrors.oldPassword.length > 0}
            helperText={state.inputErrors.oldPassword}
            value={state.inputs.oldPassword}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            autoComplete="off"
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="new_password"
            error={state.inputErrors.newPassword.length > 0}
            helperText={state.inputErrors.newPassword}
            value={state.inputs.newPassword}
            onChange={handleOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            autoComplete="off"
            fullWidth
            name="passwordConfirmation"
            label="Confirm Password"
            type="password"
            id="confirm_password"
            error={state.inputErrors.passwordConfirmation.length > 0}
            helperText={state.inputErrors.passwordConfirmation}
            value={state.inputs.passwordConfirmation}
            onChange={handleOnChange}
          />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
        change password
      </Button>
    </form>
  );
}

export default withSnackbar(PasswordForm);
