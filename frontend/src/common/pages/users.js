import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import LoginForm from "../forms/login_form";
import RegisterForm from "../forms/register_form";
import NavigationBar from "../components/NavBar";
import Messages from "../../messages/pages/Messages";
import Forum from "../../forum/pages/Forum";
import Chatbot from "../../chatbot/pages/Chatbot";
import Appointments from "../../appointments/pages/Appointments";
import { AuthContext } from "../utils/auth";

const { Content } = Layout;

const Users = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Layout className="layout">
        <NavigationBar isLoggedIn={isLoggedIn} />
        <Content style={{ height: "100vh", width: "100vw", padding: 0 }}>
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/messages" component={Messages} />
            <Route path="/forum" component={Forum} />
            <Route path="/chatbot" component={Chatbot} />
            <Route path="/appointments" component={Appointments} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};

export default Users;
