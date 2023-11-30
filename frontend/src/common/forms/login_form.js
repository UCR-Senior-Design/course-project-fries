import React, {useContext} from 'react';
import {Form, Input, Button, notification} from 'antd';
import axios from 'axios';
import {AuthContext} from "../utils/auth";

const LoginForm = () => {
  const {login} = useContext(AuthContext);
  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', values);

      if (response.data.success) {
        notification.success({message: 'Logged in successfully!'});
        login();
      } else {
        notification.error({message: 'Login failed. Please check your credentials.'});
      }
    } catch (error) {
      notification.error({message: 'An error occurred during login.'});
    }
  };

  return (
    <>
      <h1>Login</h1>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <Form onFinish={handleLogin}>
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
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
