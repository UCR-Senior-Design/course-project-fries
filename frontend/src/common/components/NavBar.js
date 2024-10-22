import React, {useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Layout, Menu, Typography} from 'antd';
import {useAuth} from "../utils/auth";

const {Header} = Layout;
const {Text} = Typography;

const NavigationBar = () => {
  const {isLoggedIn, logout} = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!isLoggedIn && history.location.pathname !== '/register') {
      history.push('/login');
    }
  }, [isLoggedIn, history]);

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  const menuItems = [
    ...(isLoggedIn
      ? [
        {
          key: "forum",
          label: <Link to="/forum">Forum</Link>,
        },
        {
          key: "message",
          label: <Link to="/messages">Message</Link>,
        },
        {key: "chatbot", label: <Link to="/chat">Chatbot</Link>},
        {
          key: "appointments",
          label: <Link to="/appointments">Appointment</Link>,
        },
        {key: "spacer", label: "", style: {flexGrow: 0.99}},
        {key: "logout", label: "Logout", onClick: handleLogout},
      ]
      : [
        {key: "spacer", label: "", style: {flexGrow: 0.99}},
        {key: "login", label: <Link to="/login">Login</Link>},
        {key: "register", label: <Link to="/register">Register</Link>},
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
      <Text style={{color: 'white', fontSize: '24px'}}>MedShare</Text>
      <Menu theme="dark" mode="horizontal" style={{flex: 1}} items={menuItems}/>
    </Header>
  );
};

export default NavigationBar;
