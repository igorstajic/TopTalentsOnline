import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import intersection from 'lodash/intersection';

import SelectControl from '../../components/SelectControl';
import categories from '../../data/categories';
import subCategories from '../../data/subcategories';

const useStyles = makeStyles(theme => ({
  filters: {
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
  },
}));

export default function Filters({ allProfiles = [], setFilteredProfiles }) {
  const classes = useStyles();

  const [searchText, setSearchText] = useState('');
  const [searchCategories, setSearchCategories] = useState([]);
  const [searchSubCategories, setSearchSubCategories] = useState([]);

  useEffect(() => {
    const filteredProfiles = allProfiles.filter(profile => {
      const matchesSearchStirng =
        searchText.trim().length === 0 ||
        `${profile.firstName} ${profile.lastName} ${profile.city} ${profile.country}`.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategoryFilter = searchCategories.length === 0 || searchCategories.includes(profile.category);

      const matchesSubCategoryFilter = searchSubCategories.length === 0 || intersection(searchSubCategories, profile.subCategories).length;

      return matchesSearchStirng && matchesCategoryFilter && matchesSubCategoryFilter;
    });
    setFilteredProfiles(filteredProfiles);
  }, [allProfiles, searchCategories, searchSubCategories, searchText, setFilteredProfiles]);
  return (
    <Paper className={classes.filters}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box display={'flex'} p={1} alignItems={'flex-end'} height={'100%'}>
            <TextField
              id="searchText"
              label="Search"
              placeholder="Type to search..."
              name="searchText"
              fullWidth
              value={searchText}
              onChange={ev => setSearchText(ev.target.value)}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box p={1}>
            <SelectControl
              options={categories}
              label="Categories"
              isMulty
              placeholder="Filter..."
              value={searchCategories}
              onSelect={selected => setSearchCategories(selected)}
            />
          </Box>

          <Box p={1}>
            <SelectControl
              options={subCategories}
              label="Skills"
              isMulty
              placeholder="Add..."
              value={searchSubCategories}
              onSelect={selected => setSearchSubCategories(selected)}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
