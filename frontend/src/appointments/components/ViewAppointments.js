import React, { useState, useEffect } from "react";
import styles from "../pages/Appointments.module.css";
import { useAuth } from "../../common/utils/auth";
import { Layout } from "antd";

const { Content } = Layout;

const ViewAppointments = () => {
  const { userId } = useAuth();
  const [appt, setAppt] = useState([]);

  const baseUrl = "http://localhost:5001/api/appointments";

  useEffect(() => {
    fetch(`${baseUrl}/viewappointments/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <Content>hi</Content>
    </Layout>
  );
};

export default ViewAppointments;
