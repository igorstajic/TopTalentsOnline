import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';

import FindIcon from '@material-ui/icons/FindInPage';
import HomeIcon from '@material-ui/icons/Home';

import RouterLink from '../components/RouterLink';

const useStyles = makeStyles(theme => ({
  emptyStateIcon: {
    fontSize: theme.spacing(12),
  },

  button: {
    marginTop: theme.spacing(1),
  },

  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
}));
export default function NotFound() {
  const classes = useStyles();
  return (
    <Fade in={true}>
      <div className={classes.center}>
        <FindIcon className={classes.emptyStateIcon} color="action" />
        <Typography color="textSecondary" variant="h4">
          Content Not Found
        </Typography>
        <Typography color="textSecondary" variant="subtitle1">
          The requested URL was not found on this server
        </Typography>
        <Fab className={classes.button} color="secondary" component={RouterLink} to="/" variant="extended">
          <HomeIcon className={classes.buttonIcon} /> BROWSE TALENTS
        </Fab>
      </div>
    </Fade>
  );
}
