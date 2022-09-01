import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import loadable from '@loadable/component';

const LogIn = loadable(() => import('@pages/login'));
const SignUp = loadable(() => import('@pages/signup'));
const WorkSpace = loadable(() => import('@layouts/workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace" component={WorkSpace} />
    </Switch>
  );
};

export default App;
