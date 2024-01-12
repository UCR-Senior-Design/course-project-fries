import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';

const RegisterForm = () => {
  const handleRegister = async (values) => {
    try {
      const response = await axios.post('http://localhost:5001/api/users/register', values);

      if (response.data.success) {
        notification.success({ message: 'Registration successful!' });
      } else {
        notification.error({ message: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      notification.error({ message: 'An error occurred during registration.' });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Register</h1>
        <Form
          onFinish={handleRegister}
          style={{ maxWidth: 300 }}
          initialValues={{ // Set initial values if needed
            email: '',
            username: '',
            password: '',
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default RegisterForm;
