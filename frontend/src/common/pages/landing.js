import React from 'react';
import {Layout} from 'antd';
import NavigationBar from "../components/NavBar";

const LandingPage = () => {
  return (
    <Layout className="layout" style={{height: "100vh"}}>
      <NavigationBar/>
    </Layout>
  );
};

export default LandingPage;
