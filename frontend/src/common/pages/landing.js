import React from "react";
import { Layout } from "antd";
import NavigationBar from "../components/NavBar";
import Landing from "../components/Landing";

const LandingPage = () => {
  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <NavigationBar />
      <Landing />
    </Layout>
  );
};

export default LandingPage;
