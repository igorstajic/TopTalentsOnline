//@flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

import RouterLink from '../components/RouterLink';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    textDecoration: 'none',
  },
}));

export default function TopBar({ isAuthenticated }: { isAuthenticated: bool }) {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography color="inherit" component={RouterLink} to="/" variant="h6" className={classes.title}>
          TopTalents Online
        </Typography>
        {isAuthenticated ? (
          <IconButton
            component={RouterLink}
            to="/login"
            aria-label="Account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// TopBar.defaultProps = {
//   isAuthenticated: false,
// };
