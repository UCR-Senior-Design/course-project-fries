import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import AuthProvider from "./common/utils/auth";
import Appointments from "./appointments/pages/Appointments";
import Forum from "./forum/pages/Forum";
import Messages from "./messages/pages/Messages";
import Patient from "./patient/pages/Patient";
import Chatbot from "./chatbot/pages/Chatbot";
import Users from "./common/pages/landing";
import AppointmentForm from "./appointments/components/AppointmentForm";
import AppointmentSlots from "./appointments/components/AppointmentSlots";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" exact={true}>
            <Users />
          </Route>
          <Route path="/appointments" exact={true}>
            <Appointments />
          </Route>
          <Route path="/AppointmentForm" exact={true}>
            <AppointmentForm />
          </Route>
          <Route path="/AppointmentSlots" exact={true}>
            <AppointmentSlots />
          </Route>
          <Route path="/chatbot" exact={true}>
            <Chatbot />
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
    </AuthProvider>
  );
};

export default App;
