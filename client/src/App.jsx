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
          <TopBar user={currentUser} />
          <main>
            <Switch>
              <Route exact path="/" component={Public} />
              {currentUser ? <Redirect path="/login" to="/" /> : <Route path="/login" component={Login} />}
              {currentUser ? <Redirect path="/sign-up" to="/" /> : <Route path="/sign-up" component={SignUp} />}
              <Route component={NotFound} />
            </Switch>
          </main>
        </SessionContext.Provider>
      </Router>
    </SnackbarProvider>
  );
}

export default hot(module)(App);
