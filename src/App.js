import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import Connection from './Connection';
import Command from './Command';
import Pim from './Pim';
import Autotest from './Autotest';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Connection} />
        <Route exact path="/command" component={Command} />
        <Route path="/pim" component={Pim} />
        <Route path="/autotest" component={Autotest} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
