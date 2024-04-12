import React, { useState } from "react";
import CalendarView from "../components/CalendarView";
import ViewAppointments from "../components/ViewAppointments";
import NavigationBar from "../../common/components/NavBar";
import styles from "../pages/Appointments.module.css";
import { Button } from "antd";
import { useAuth } from "../../common/utils/auth";
import { Layout } from "antd";

const { Content } = Layout;

const Appointments = () => {
  const { userId } = useAuth();
  const [viewApptment, setViewApptment] = useState(false);
  const [viewBook, setViewBook] = useState(true);

  const handle_view = () => {
    setViewApptment(true);
    setViewBook(false);
  };
  const handle_book = () => {
    setViewBook(true);
    setViewApptment(false);
  };

  return (
    // <Layout className="App">
    <Layout className="layout" style={{ height: "100vh" }}>
      {" "}
      <header className="App-header">
        <NavigationBar />
      </header>
      <div style={{ display: "inline-block" }}>
        <Button onClick={handle_view} style={{ width: "50%" }}>
          View Appointments
        </Button>
        <Button onClick={handle_book} style={{ width: "50%" }}>
          Book appointments
        </Button>
      </div>
      {viewApptment ? <ViewAppointments /> : viewBook ? <CalendarView /> : null}
    </Layout>
  );
};

export default Appointments;
