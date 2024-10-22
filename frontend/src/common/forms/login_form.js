import React from 'react';
import {useHistory} from 'react-router-dom';
import {Form, Input, Button, Layout, notification} from 'antd';
import axios from 'axios';
import {useAuth} from "../utils/auth";
import NavigationBar from "../components/NavBar";

const LoginForm = () => {
  const {login} = useAuth();
  const history = useHistory();

  const handleLogin = async (values) => {
    const {email, password} = values;
    try {
      const res = await axios.post('http://localhost:5001/api/users/login', {email, password});
      login(res.data.token);
      if (res.status === 201) {
        notification.success({message: res.data.message});
        history.push('/');
      } else {
        notification.error({message: res.data.message});
      }
    } catch (err) {
      notification.error({message: err.response.data.message});
      console.log(err);
    }
  };

  return (
    <Layout className="layout" style={{height: "100vh"}}>
      <NavigationBar/>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h1 style={{marginBottom: '20px'}}>Login</h1>
        <Form onFinish={handleLogin} style={{width: '300px'}}>
          <Form.Item
            name="email"
            rules={[{required: true, message: 'Please enter your email'}]}
          >
            <Input placeholder="Email"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: 'Please enter your password'}]}
          >
            <Input.Password placeholder="Password"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default LoginForm;
