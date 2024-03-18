import React, { useState, useEffect } from "react";
import styles from "../pages/Appointments.module.css";
import { useAuth } from "../../common/utils/auth";
import { Layout, Table, Button } from "antd";

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
        setAppt(data.appt_list);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctor_name",
      key: "doctor_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Delete Appointment",
      key: "action",
      render: (_, record) => (
        <Button className={styles.deletebutton}>Delete</Button>
      ),
    },
  ];

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <Content style={{ padding: "0 40px" }}>
        {" "}
        <h1>Your Appointments</h1>
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={appt}
        />
      </Content>
    </Layout>
  );
};

export default ViewAppointments;
