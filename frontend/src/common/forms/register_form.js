import React from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, notification, Select, Layout } from "antd";

import axios from "axios";
import NavigationBar from "../components/NavBar";

const {Option} = Select;

const RegisterForm = () => {
  const history = useHistory();

  const handleRegister = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/users/register",
        values
      );

      if (res.status === 201) {
        notification.success({message: res.data.message});
        history.push('/login');
      } else {
        notification.error({message: res.data.message});
      }
    } catch (error) {
      notification.error({ message: "An error occurred during registration." });
    }
  };

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <NavigationBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Register</h1>
        <Form
          onFinish={handleRegister}
          style={{ maxWidth: 300 }}
          initialValues={{
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            role: undefined,
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="firstname"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="First name" />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Last name" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please select your role" }]}
          >
            <Select placeholder="Please select your role">
              <Option value="patient">Patient</Option>
              <Option value="doctor">Doctor</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
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
    </Layout>
  );
};

export default RegisterForm;
