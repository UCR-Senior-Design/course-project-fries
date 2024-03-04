import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import {AuthProvider} from "./common/utils/auth";
import Appointments from "./appointments/pages/Appointments";
import Forum from "./forum/pages/Forum";
import Messages from "./messages/pages/Messages";
import Patient from "./patient/pages/Patient";
import Chatbot from "./chatbot/pages/Chatbot";
import AppointmentForm from "./appointments/components/AppointmentForm";
import LoginForm from "./common/forms/login_form";
import RegisterForm from "./common/forms/register_form";
import LandingPage from "./common/pages/landing";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" exact={true} component={LoginForm} />
          <Route path="/register" exact={true} component={RegisterForm} />
          <Route path="/" exact={true} component={LandingPage} />
          <Route path="/appointments" exact={true}>
            <Appointments />
          </Route>
          <Route path="/AppointmentForm" exact={true}>
            <AppointmentForm />
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
