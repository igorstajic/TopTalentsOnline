//@flow
import { hot } from 'react-hot-loader';
import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { getAuthenticatedUser, SessionContext } from './helpers/session';
import TopBar from './layout/TopBar';
import Loading from './layout/Loading';

import Public from './pages/Public';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import EditProfile from './pages/EditProfile';

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
    return <Loading />;
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
              <Route exact path="/" component={Public} />
              <Route path="/login" render={({ history }) => (currentUser ? <Redirect to="/" /> : <Login history={history} />)} />
              <Route path="/sign-up" render={({ history }) => (currentUser ? <Redirect to="/" /> : <SignUp history={history} />)} />
              <Route path="/edit-profile" render={({ history }) => (!currentUser ? <Redirect to="/login" /> : <EditProfile history={history} />)} />

              <Route component={NotFound} />
            </Switch>
          </main>
        </SessionContext.Provider>
      </Router>
    </SnackbarProvider>
  );
}

export default hot(module)(App);
