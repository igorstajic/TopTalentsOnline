//@flow
import React, { useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';

import LoadingIndicatior from '../../layout/LoadingIndicator';
import axios from '../../configs/axios';

import InfoForm from './InfoForm';
import PasswordForm from './PasswordForm';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    marginBottom: theme.spacing(3),
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

function EditProfile({ profileId, enqueueSnackbar }: { profileId: string, enqueueSnackbar: Function }) {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState(0);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProfileData() {
      try {
        const getProfileResponse = await axios.get(`/users/${profileId}`);
        setProfileData(getProfileResponse.data.user);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
      }
    }
    getProfileData();
  }, [enqueueSnackbar, profileId]);
  return (
    <>
      {isLoading && (
        <Fade in={isLoading}>
          <LoadingIndicatior />
        </Fade>
      )}
      <Fade in={!isLoading}>
        <Container component="section" maxWidth="sm">
          <div className={classes.paper}>
            <Typography className={classes.title} component="h1" variant="h4">
              Edit Profile
            </Typography>

            <Tabs className={classes.tabBar} value={activeTab} onChange={(event, newTab) => setActiveTab(newTab)}>
              <Tab className={classes.tabItem} label="info" />
              <Tab className={classes.tabItem} label="password" />
            </Tabs>

            {activeTab === 0 && (
              <Fade in={true}>
                <Paper className={classes.tabContent}>
                  <InfoForm profileData={profileData} />
                </Paper>
              </Fade>
            )}
            {activeTab === 1 && (
              <Fade in={true}>
                <Paper className={classes.tabContent}>
                  <PasswordForm />
                </Paper>
              </Fade>
            )}
          </div>
        </Container>
      </Fade>
    </>
  );
}

export default withSnackbar(EditProfile);
