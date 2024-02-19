import React from 'react';
import {BrowserRouter as Router, Route, Switch,} from 'react-router-dom';
import {Layout,} from 'antd';
import LoginForm from '../forms/login_form';
import RegisterForm from '../forms/register_form';
import NavigationBar from '../components/NavBar'

const {Content} = Layout;

const Users = () => {
  return (
    <Router>
      <Layout className="layout">
        <NavigationBar />
        <Content style={{height: '100vh', width: '100vw', padding: 0}}>
          <Switch>
            <Route path="/login" component={LoginForm}/>
            <Route path="/register" component={RegisterForm}/>
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};

export default Users;
