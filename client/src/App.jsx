//@flow
import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TopBar from './layout/TopBar';

import Public from './pages/Public';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <CssBaseline />
      <TopBar isAuthenticated={false} />
      <main>
        <Switch>
          <Route exact path="/" component={Public} />
          <Route path="/login" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

const root = document.getElementById('root');

if (root !== null) {
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    root
  );
}
