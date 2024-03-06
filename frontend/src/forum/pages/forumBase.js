import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import Forum from "./Forum";
import NavigationBar from "../../common/components/NavBar";
import { AuthContext } from "../../common/utils/auth";
const { Content } = Layout;

const ForumBase = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      <Layout className="layout">
        <NavigationBar isLoggedIn={isLoggedIn} />
        <Content style={{ height: "100vh", width: "100vw", padding: 0 }}>
          <Switch>
            <Route path="/forum" component={Forum} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};

export default ForumBase;
