import React, { useState, useEffect } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { withSnackbar } from 'notistack';

import axios from '../../configs/axios';
import LoadingIndicator from '../../layout/LoadingIndicator';

import Filters from './Filters';
import List from './CardList';

function PublicProfiles({ enqueueSnackbar }) {
  const [isLoading, setIsLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => {
    async function getProfileData() {
      try {
        const getProfilesResponse = await axios.get(`/users/`);
        setAllProfiles(getProfilesResponse.data.users);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
      }
    }
    getProfileData();
  }, [enqueueSnackbar]);

  return (
    <Container maxWidth="lg" component="section">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Filters allProfiles={allProfiles} setFilteredProfiles={setFilteredProfiles} />
          </Grid>
          <Container maxWidth="md" component="section">
            <List profiles={filteredProfiles} />
          </Container>
        </Grid>
      )}
    </Container>
  );
}

export default withSnackbar(PublicProfiles);
