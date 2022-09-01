import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import LogIn from '@pages/login';
import SignUp from '@pages/signup';
import Channel from '@pages/channel';

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/channel" component={Channel} />
    </Switch>
  );
};

export default App;
