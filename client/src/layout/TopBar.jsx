import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';

import Menu from '@material-ui/core/Menu';
import RouterLink from '../components/RouterLink';
import { SessionContext, clearSession } from '../services/session';
import Slide from '@material-ui/core/Slide';

import MailIcon from '@material-ui/icons/Mail';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    textDecoration: 'none',
  },
});

export default function TopBar() {
  const session = useContext(SessionContext);

  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleLogout = () => {
    session.setCurrentUser(null);
    clearSession();
    handleMenuClose();
  };

  return (
    <Slide direction="down" in={true}>
      <AppBar position="static">
        <Toolbar>
          <Typography color="inherit" component={RouterLink} to="/" variant="h6" className={classes.title}>
            TopTalents Online
          </Typography>
          {session.currentUser && (
            <IconButton color="inherit" component={RouterLink} to="/inbox">
              <MailIcon />
            </IconButton>
          )}
          {session.currentUser ? (
            <IconButton
              onClick={ev => setMenuAnchor(ev.currentTarget)}
              aria-label="Account of current user"
              aria-controls="account-menu"
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
          <Menu
            anchorEl={menuAnchor}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem component={RouterLink} to={`/profile/${session.currentUser.id}`} onClick={handleMenuClose}>
              My Profile
            </MenuItem>
            <MenuItem component={RouterLink} to="/edit-profile" onClick={handleMenuClose}>
              Edit Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

// TopBar.defaultProps = {
//   isAuthenticated: false,
// };
