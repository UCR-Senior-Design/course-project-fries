import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Appointments from "./appointments/pages/Appointments";
import Forum from "./forum/pages/Forum";
import Messages from "./messages/pages/Messages";
import Patient from "./patient/pages/Patient";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <h1>Home Page</h1>
        </Route>
        <Route path="/appointments" exact={true}>
          <Appointments />
        </Route>
        <Route path="/forum" exact={true}>
          <Forum />
        </Route>
        <Route path="/messages" exact={true}>
          <Messages />
        </Route>
        <Route path="/patient" exact={true}>
          <Patient />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
