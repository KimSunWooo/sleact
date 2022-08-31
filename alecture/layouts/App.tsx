import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import LogIn from '@pages/login';
import SignUp from '@pages/signup';

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;
