import React, { useContext } from "react";
import { Route, Link } from 'react-router-dom';
import CalendarView from '../components/CalendarView';
import Notification from '../components/Notification';
import NavigationBar from "../../common/components/NavBar";
import styles from '../pages/Appointments.module.css';
import { AuthContext } from "../../common/utils/auth";

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { login, logout } = useContext(AuthContext);
  login();

  return (
    <div className="App">
      <header className="App-header">
      <NavigationBar />
      </header>
      <CalendarView />
    </div>
  );
}

export default App;
