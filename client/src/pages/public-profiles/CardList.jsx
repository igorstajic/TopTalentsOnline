import React, { useState, useContext } from 'react';

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

import RouterLink from '../../components/RouterLink';
import ContactForm from '../../components/ContactForm';
import { SessionContext } from '../../services/session';
import { makeLocationString } from '../../helpers/formatters';

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
  location: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  noProfiles: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
    width: '100%',
  },
}));

export default function CardList({ profiles }) {
  const session = useContext(SessionContext);

  const classes = useStyles();
  const [isShowingContactForm, showContactForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});

  return (
    <Grid className={classes.cardList} container item spacing={2}>
      {profiles.length > 0 ? (
        profiles.map(profile => (
          <Grid className={classes.cardWrapper} key={profile.id} item xs={12} sm={6} md={4}>
            <Zoom in={true}>
              <Card className={classes.card}>
                <CardHeader
                  action={
                    <IconButton component={RouterLink} to={`/profile/${profile.id}`} aria-label="Settings">
                      <InfoIcon />
                    </IconButton>
                  }
                  title={`${profile.firstName} ${profile.lastName}`}
                  subheader={<span className={classes.cardHeader__subtitle}>{profile.category}</span>}
                />
                <CardContent className={classes.card__content}>
                  <Typography className={classes.location} component="p" variant="body1">
                    {(profile.city || profile.country) && <LocationIcon color="action" />}
                    {makeLocationString(profile.city, profile.country)}
                  </Typography>

                  {profile.subCategories.length > 0 && <Typography component="h4">Skills:</Typography>}
                  {profile.subCategories.map((skill, idx) => (
                    <Chip className={classes.chip} color="secondary" key={`${skill}_${idx}`} label={skill} />
                  ))}
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedProfile(profile);
                      showContactForm(true);
                    }}
                  >
                    Contact
                  </Button>
                  {session.currentUser && session.currentUser.type === 'admin' && (
                    <Button color="secondary" size="small" component={RouterLink} to={`/admin/edit-profile/${profile.id}`}>
                      Edit
                    </Button>
                  )}
                  {session.currentUser && session.currentUser.type === 'admin' && (
                    <Button color="secondary" size="small" component={RouterLink} to={`/admin/messages/${profile.id}`}>
                      Messages
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Zoom>
          </Grid>
        ))
      ) : (
        <Typography component="span" variant="body1" className={classes.noProfiles} color="textSecondary">
          No profiles.
        </Typography>
      )}
      <ContactForm uid={selectedProfile.id} isOpen={isShowingContactForm} handleClose={() => showContactForm(false)} />
    </Grid>
  );
}
