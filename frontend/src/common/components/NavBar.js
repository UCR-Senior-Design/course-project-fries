import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { AuthContext } from "../utils/auth";

const { Header } = Layout;
const { Text } = Typography;

const NavigationBar = ({ isLoggedIn }) => {
  const history = useHistory();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    logout();
    // Redirect to home page
    history.push("/");
  };

  const menuItems = [
    {
      key: "forum",
      label: <Link to="/forum">Forum</Link>,
    },
    {
      key: "message",
      label: <Link to="/messages">Message</Link>,
    },
    { key: "chatbot", label: <Link to="/chatbot">Chatbot</Link> },
    { key: "appointments", label: <Link to="/appointments">Appointment</Link>},
    { key: "spacer", label: "", style: { flexGrow: 1 } },
    ...(isLoggedIn
      ? [{ key: "logout", label: "Logout", onClick: handleLogout }]
      : [
          { key: "login", label: <Link to="/login">Login</Link> },
          { key: "register", label: <Link to="/register">Register</Link> },
        ]),
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: "white", fontSize: "24px" }}>MedShare</Text>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ flex: 1 }}
        items={menuItems}
      />
    </Header>
  );
};

export default NavigationBar;
