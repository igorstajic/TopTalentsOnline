import React, { useState, useEffect, useCallback } from 'react';

import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InfoIcon from '@material-ui/icons/Info';
import LocationIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withSnackbar } from 'notistack';
import intersection from 'lodash/intersection';

import axios from '../configs/axios';
import SelectControl from '../components/SelectControl';
import categories from '../data/categories';
import subCategories from '../data/subcategories';

const useStyles = makeStyles(theme => ({
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  filters: {
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(4),
    padding: theme.spacing(1),
  },
  filters__selectors: {
    flex: 1,
    width: '50%',
  },
  cardList: {
    padding: theme.spacing(2),
  },
  cardWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '18em',
    minWidth: 275,
    display: 'flex',
    flexDirection: 'column',
  },
  card__content: {
    flex: 1,
  },
  cardHeader__subtitle: {
    textTransform: 'capitalize',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));
function Public({ enqueueSnackbar }) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchCategories, setSearchCategories] = useState([]);
  const [searchSubCategories, setSearchSubCategories] = useState([]);

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

  useEffect(() => {
    const filteredProfiles = allProfiles.filter(profile => {
      const matchesSearchStirng =
        searchText.trim().length === 0 ||
        `${profile.firstName} ${profile.lastName} ${profile.city} ${profile.country}`.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategoryFilter = searchCategories.length === 0 || searchCategories.includes(profile.category);
      console.log(intersection(profile.subCategories, searchSubCategories));
      console.log("TCL: Public -> searchSubCategories", searchSubCategories)
      console.log("TCL: Public -> profile.subCategories", profile.subCategories)
      const matchesSubCategoryFilter = searchSubCategories.length === 0 || intersection(searchSubCategories, profile.subCategories).length;

      return matchesSearchStirng && matchesCategoryFilter && matchesSubCategoryFilter;
    });
    setFilteredProfiles(filteredProfiles);
  }, [allProfiles, searchCategories, searchSubCategories, searchText]);

  return (
    <Container maxWidth="lg" component="section">
      {isLoading ? (
        <div className={classes.center}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          </Grid>
          <Container maxWidth="md" component="section">
            <Grid className={classes.cardList} container item spacing={2}>
              {filteredProfiles.map(profile => (
                <Grid className={classes.cardWrapper} key={profile.id} item xs={12} sm={6} md={4}>
                  <Zoom in={true}>
                    <Card className={classes.card}>
                      <CardHeader
                        action={
                          <IconButton aria-label="Settings">
                            <InfoIcon />
                          </IconButton>
                        }
                        title={`${profile.firstName} ${profile.lastName}`}
                        subheader={<span className={classes.cardHeader__subtitle}>{`${profile.category}`}</span>}
                      />
                      <CardContent className={classes.card__content}>
                        <Typography className={classes.labelContainer} component="p" variant="body1">
                          <LocationIcon color="action" /> {`${profile.city}, ${profile.country}`}
                        </Typography>

                        {profile.subCategories.length > 0 && <Typography component="h4">Skills:</Typography>}
                        {profile.subCategories.map((skill, idx) => (
                          <Chip className={classes.chip} color="secondary" key={`${skill}_${idx}`} label={skill} />
                        ))}
                      </CardContent>
                      <CardActions>
                        <Button color="primary" size="small">
                          contact
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Grid>
      )}
    </Container>
  );
}

export default withSnackbar(Public);
