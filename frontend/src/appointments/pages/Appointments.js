import React from 'react';
import { Route, Link } from 'react-router-dom';
import CalendarView from '../components/CalendarView';
import NavigationBar from "../../common/components/NavBar";
import styles from '../pages/Appointments.module.css';

const App = () => {
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
