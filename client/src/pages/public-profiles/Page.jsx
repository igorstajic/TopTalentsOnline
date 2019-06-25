import React, { useState, useEffect, useCallback } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withSnackbar } from 'notistack';

import axios from '../../configs/axios';
import LoadingIndicator from '../../layout/LoadingIndicator';

import Filters from './Filters';
import List from './CardList';

function PublicProfiles({ enqueueSnackbar }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: '',
    categories: [],
    subCategories: [],
  });

  const loadProfiles = useCallback(
    async ({ currentPage = 1, appendOn = [] }) => {
      try {
        setIsLoadingMore(true);
        const getProfilesResponse = await axios.get(
          `/users?categories=${filters.categories}&subCategories=${filters.subCategories}&filter=${
            filters.searchTerm
          }&page=${currentPage}&limit=3`
        );
        if (appendOn) {
          setProfiles([...appendOn, ...getProfilesResponse.data.users]);
        } else {
          setProfiles(getProfilesResponse.data.users);
        }
        setHasMore(getProfilesResponse.data.hasMore);
        setIsLoading(false);
        setIsLoadingMore(false);
      } catch (error) {
        enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
      }
    },
    [enqueueSnackbar, filters.categories, filters.searchTerm, filters.subCategories]
  );
  useEffect(() => {
    loadProfiles({});
  }, [loadProfiles]);

  useEffect(() => {
    setPage(1);
  }, [filters.searchTerm, filters.subCategories, filters.categories]);

  const handleLoadMore = () => {
    loadProfiles({ currentPage: page + 1, appendOn: profiles });
    setPage(page + 1);
  };

  return (
    <Container maxWidth="lg" component="section">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Filters setFilters={setFilters} />
        </Grid>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <Container maxWidth="md" component="section">
            <List profiles={profiles} />
            {hasMore && (
              <Box display="flex" justifyContent="center">
                {isLoadingMore ? <CircularProgress /> : <Button onClick={handleLoadMore}>Load More</Button>}
              </Box>
            )}
          </Container>
        )}
      </Grid>
    </Container>
  );
}

export default withSnackbar(PublicProfiles);
