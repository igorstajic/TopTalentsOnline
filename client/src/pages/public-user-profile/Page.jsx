import React, { useState, useEffect } from 'react';

import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

import LocationIcon from '@material-ui/icons/LocationOn';
import MessageIcon from '@material-ui/icons/Message';

import { withSnackbar } from 'notistack';

import axios from '../../configs/axios';
import LoadingIndicator from '../../layout/LoadingIndicator';
import ContactForm from '../../components/ContactForm';

import { makeLocationString } from '../../helpers/formatters';
const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(8),
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
  category: {
    textTransform: 'capitalize',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function PublicUserProfile({ match, enqueueSnackbar }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isShowingContactForm, showContactForm] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    async function getProfileData() {
      try {
        const getProfileResponse = await axios.get(`/users/${match.params.uid}`);
        setProfile(getProfileResponse.data.user);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
      }
    }
    getProfileData();
  }, [enqueueSnackbar, match.params.uid]);

  return (
    <Container maxWidth="md" component="section" data-testid="page_container__publicProfile">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h3">
            {`${profile.firstName} ${profile.lastName}`}
          </Typography>
          <Typography className={classes.category} component="h2" variant="subtitle1">
            {profile.category}
          </Typography>

          <Box mt={4} mb={4}>
            <Typography className={classes.label} component="p" variant="body1">
              {(profile.city || profile.country) && <LocationIcon color="action" />} {makeLocationString(profile.city, profile.country)}
            </Typography>
          </Box>

          <Box mt={2}>
            {profile.subCategories.length > 0 && <Typography component="h4">Skills:</Typography>}
            {profile.subCategories.map((skill, idx) => (
              <Chip className={classes.chip} color="secondary" key={`${skill}_${idx}`} label={skill} />
            ))}
          </Box>

          <Box mt={8}>
            <Button variant="contained" color="primary" size="small" onClick={() => showContactForm(true)}>
              <Box px={2} py={1} display="flex">
                <MessageIcon color="inherit" />
                <Box ml={1}>contact</Box>
              </Box>
            </Button>
          </Box>
        </Paper>
      )}
      <ContactForm uid={match.params.uid} isOpen={isShowingContactForm} handleClose={() => showContactForm(false)} />
    </Container>
  );
}

export default withSnackbar(PublicUserProfile);
