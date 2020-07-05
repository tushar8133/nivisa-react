import React from 'react';
import { MemoryRouter, Switch, Route } from "react-router-dom";
import { Header } from './ComponentHeader';
import { Footer } from './ComponentFooter';
import { Connection } from './ComponentConnection';
import { Calibration } from './ComponentCalibration';
import { Pim } from './ComponentPim';
import { Scanner } from './ComponentScanner';

export function App() {
    return (
    <MemoryRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Connection} />
        <Route path="/pim" component={Pim} />
        <Route path="/calibration" component={Calibration} />
        <Route path="/scanner" component={Scanner} />
      </Switch>
      <Footer />
    </MemoryRouter>
    );
}