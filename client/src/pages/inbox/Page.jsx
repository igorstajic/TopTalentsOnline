//@flow
import React, { useState, useEffect } from 'react';
import { withSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import moment from 'moment';

import axios from '../../configs/axios';
import LoadingIndicator from '../../layout/LoadingIndicator';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(4),
  },
  maxWidth: 360,
  paper: {
    padding: theme.spacing(8),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inline: {
    display: 'inline',
  },
  noMessages: {
    marginTop: theme.spacing(5),
    textAlign: 'center',
  },
}));

function Inbox({ enqueueSnackbar, uid }: { uid: string, enqueueSnackbar: Function }) {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMessages() {
      try {
        const getMessagesResponse = await axios.get(`/messages/for-user/${uid}`);
        setMessages(getMessagesResponse.data.messages);
        setIsLoading(false);
      } catch (error) {
        enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
      }
    }
    getMessages();
  }, [enqueueSnackbar, uid]);

  const handleDelete = async messageID => {
    try {
      await axios.delete(`/messages/${messageID}`);
      setMessages(messages.filter(m => m.id !== messageID));
    } catch (error) {
      enqueueSnackbar(String(error.response.data.details || 'Something went wrong!'), { variant: 'error' });
    }
  };
  return (
    <Container maxWidth="md" component="section">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4">
            {`My Messages`}
          </Typography>
          {messages.length > 0 ? (
            <List className={classes.list}>
              {messages.map((messageItem, idx) => (
                <>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{`${messageItem.contactName.split(' ').reduce((initials, word) => `${initials}${word[0]}`, '')}`}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contactDetails({ name: messageItem.contactName, email: messageItem.from })}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                            {moment(messageItem.timestamp).format('DD MMM, YYYY HH:mm')}
                          </Typography>
                          {` — ${messageItem.message}`}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="Delete" onClick={() => handleDelete(messageItem.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {idx < messages.length - 1 && <Divider variant="inset" component="li" />}
                </>
              ))}
            </List>
          ) : (
            <Typography component="span" variant="body1" className={classes.noMessages} color="textSecondary">
              No messages yet.
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  );
}

const contactDetails = ({ name, email }) => (
  <span>
    <Typography>
      {`${name} `}
      <Link href={`mailto:${email}`} rel="noopener">
        {`<${email}>`}
      </Link>
    </Typography>
  </span>
);

export default withSnackbar(Inbox);
