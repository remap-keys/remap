import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Configure from './components/configure/Configure';
import Hid from './services/hid/ui/Hid';
import Top from './Top';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/hid" component={Hid} />
        <Route exact path="/configure" component={Configure} />
        <Route component={Top} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
