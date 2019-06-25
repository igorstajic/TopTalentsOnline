//@flow
import { hot } from 'react-hot-loader';
import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { getAuthenticatedUser, SessionContext } from './services/session';
import TopBar from './layout/TopBar';
import LoadingIndicator from './layout/LoadingIndicator';

import Profiles from './pages/public-profiles/Page';
import Login from './pages/login/Page';
import SignUp from './pages/sign-up/Page';
import NotFound from './pages/NotFound';
import EditProfile from './pages/edit-profile/Page';
import UserProfile from './pages/public-user-profile/Page';
import Inbox from './pages/inbox/Page';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const user = await getAuthenticatedUser();
      setCurrentUser(user);
      setIsLoading(false);
    };
    getUser();
  }, []);
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SnackbarProvider
      maxSnack={3}
      preventDuplicate
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Router>
        <SessionContext.Provider
          value={{
            currentUser,
            setCurrentUser,
          }}
        >
          <CssBaseline />
          <TopBar />
          <main>
            <Switch>
              <Route exact path="/" component={Profiles} />
              <Route path="/profile/:uid" component={UserProfile} />

              <Route path="/login" render={({ history }) => (currentUser ? <Redirect to="/" /> : <Login history={history} />)} />
              <Route path="/sign-up" render={({ history }) => (currentUser ? <Redirect to="/" /> : <SignUp history={history} />)} />
              <Route
                path="/edit-profile"
                render={({ history }) => (!currentUser ? <Redirect to="/login" /> : <EditProfile history={history} uid={currentUser.id} />)}
              />
              <Route
                path="/inbox"
                render={({ history }) => (!currentUser ? <Redirect to="/login" /> : <Inbox history={history} uid={currentUser.id} />)}
              />
              {currentUser && currentUser.type === 'admin' && (
                <Route path="/admin/edit-profile/:uid" render={({ history, match }) => <EditProfile history={history} uid={match.params.uid} />} />
              )}
              {currentUser && currentUser.type === 'admin' && (
                <Route path="/admin/messages/:uid" render={({ history, match }) => <Inbox history={history} uid={match.params.uid} />} />
              )}
              <Route component={NotFound} />
            </Switch>
          </main>
        </SessionContext.Provider>
      </Router>
    </SnackbarProvider>
  );
}

export default hot(module)(App);
