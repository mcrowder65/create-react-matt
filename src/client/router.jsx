import React from "react";
import { Router as BrowserRouter } from "react-router-dom";
import { Route } from "react-router";

import { browserHistory } from "./browser-history";
import Home from "./components/home";

const Router = () => (
  <BrowserRouter history={browserHistory}>
    <div>
      <Route exact path="/" component={Home}/>
    </div>
  </BrowserRouter>

);


export default Router;
