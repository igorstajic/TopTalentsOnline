import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Zoom from '@material-ui/core/Zoom';

import InfoIcon from '@material-ui/icons/Info';
import LocationIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
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

export default function CardList({ profiles }) {
  const classes = useStyles();

  return (
    <Grid className={classes.cardList} container item spacing={2}>
      {profiles.map(profile => (
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
  );
}
