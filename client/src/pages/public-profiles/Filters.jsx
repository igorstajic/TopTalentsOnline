import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import IconClose from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import SelectControl from '../../components/SelectControl';
import defaultCategories from '../../data/categories';
import defaultSubCategories from '../../data/subcategories';
import axios from '../../configs/axios';
import union from 'loadsh/union';

const useStyles = makeStyles(theme => ({
  filters: {
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
  },
  text: {
    width: '100%',
  },
}));

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
}

export default function Filters({ setFilters }) {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategories, setSearchCategories] = useState([]);
  const [searchSubCategories, setSearchSubCategories] = useState([]);

  const [allCategories, setAllCategories] = useState(defaultCategories);
  const [allSubCategories, setAllSubCategories] = useState(defaultSubCategories);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const getAdditionalFilters = async () => {
      try {
        const getFiltersResponse = await axios.get('/filters/all');
        setAllCategories(union(getFiltersResponse.data.categories, defaultCategories));
        setAllSubCategories(union(getFiltersResponse.data.subCategories, defaultSubCategories));
      // eslint-disable-next-line no-empty
      } catch (error) {}
    };
    getAdditionalFilters();
  }, []);

  useEffect(() => {
    setFilters({ searchTerm: debouncedSearchTerm, categories: searchCategories, subCategories: searchSubCategories });
  }, [debouncedSearchTerm, searchCategories, searchSubCategories, setFilters]);
  return (
    <Paper className={classes.filters}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box display={'flex'} p={1} alignItems={'flex-end'} height={'100%'}>
            <FormControl className={classes.text}>
              <InputLabel htmlFor="search-text">Search</InputLabel>
              <Input
                id="search-text"
                placeholder="Type to search..."
                type={'text'}
                value={searchTerm}
                onChange={ev => setSearchTerm(ev.target.value)}
                endAdornment={
                  searchTerm.length > 0 && (
                    <InputAdornment position="end">
                      <IconButton aria-label="Toggle password visibility" onClick={() => setSearchTerm('')}>
                        <IconClose />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box p={1}>
            <SelectControl
              options={allCategories}
              label="Categories"
              isMulty
              placeholder="Filter..."
              value={searchCategories}
              onSelect={selected => setSearchCategories(selected)}
            />
          </Box>

          <Box p={1}>
            <SelectControl
              options={allSubCategories}
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
