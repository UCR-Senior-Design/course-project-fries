import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { DatePicker, Switch, Button, Radio, Table, Modal, Layout } from "antd";
import NavigationBar from "../../common/components/NavBar";
import styles from "../pages/Appointments.module.css";
import AppointmentForm from "../components/AppointmentForm";
const { Content, Footer } = Layout;

const AppointmentSlots = (props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [AM, setAM] = useState(true);
  const [error, setError] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const slotsAM = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00"];
  const slotsPM = ["1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"];

  const baseUrl = "http://localhost:5001/api/appointments";

  const timeHandler = (event) => {
    setError("");
    setTime(event.target.value);
  };

  const switchHandler = () => {
    setError("");
    setAM(!AM);
  };

  const dateHandler = (date, datestring) => {
    setError("");
    setDate(date);
  };

  const validateInput = () => {
    if (time === "" || date === "") {
      setError("All fields are required");
      return false;
    } else {
      return true;
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkHandler = () => {
    if (time !== "" && date !== "") {
      // filter list
      const queryParams = new URLSearchParams({
        data: JSON.stringify({
          date: date,
          time: time,
        }),
      });

      fetch(`http://localhost:5001/api/appointments/listdoctors?${queryParams}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data.doctors_list);
        })
        .catch((error) => {
          console.error(error);
        });
      setShowTable(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Users must input date and time before selecting a doctor
  const selectDoctorHandler = (data) => {
    setSelectedDoc(data);
    if (validateInput() === true) {
      setShowForm(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "doc_name",
      key: "doc_id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Select Doctor",
      key: "action",
      render: (_, record) => (
        <Button className={styles.selectbutton}>Select</Button>
      ),
    },
  ];

  const Back = () => {
    window.location.href = "/appointments";
  };

  return (
    // <Layout className={`${styles["appt-form"]} ${styles.AppointmentForm}`}>
    <Layout style={{ minHeight: "100vh" }}>
      <NavigationBar />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Please select preferred appointment date and time.</h2>
      </div>

      <Modal
        title="Error"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Please select date and time of appointment.</p>
      </Modal>

      <Content style={{ minHeight: "100vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            padding: "10px",
          }}
        >
          <Switch
            checkedChildren="AM"
            unCheckedChildren="PM"
            defaultChecked
            onChange={switchHandler}
          />
          {AM ? (
            <Radio.Group
              className={styles.radioGroup}
              name="slotTime"
              value={time}
              onChange={timeHandler}
            >
              {slotsAM.map((item) => (
                <Radio key={item} value={`${item} AM`}>{`${item} AM`}</Radio>
              ))}
            </Radio.Group>
          ) : (
            <Radio.Group
              className={styles.radioGroup}
              name="slotTime"
              value={time}
              onChange={timeHandler}
            >
              {slotsPM.map((item) => (
                <Radio key={item} value={`${item} PM`}>{`${item} PM`}</Radio>
              ))}
            </Radio.Group>
          )}

          <DatePicker
            className={styles.datePicker}
            onChange={dateHandler}
          ></DatePicker>

          <Button className={styles.button} onClick={checkHandler}>
            Check Availability
          </Button>
          <Button className={styles.button} onClick={Back}>
            Back
          </Button>
        </div>
        <div>
          {showForm && (
            <AppointmentForm
              selectedDoc={selectedDoc}
              date={date}
              time={time}
            />
          )}

          {showTable && (
            <div className={styles.text} style={{ padding: "10px" }}>
              <p>
                Here are the available Doctors for your selected appointment day
                and time:
              </p>
              <Table
                rowKey={(record) => record.doc_id}
                columns={columns}
                dataSource={data}
                onRow={(record) => ({
                  onClick: () => {
                    selectDoctorHandler(record.doc_id);
                  },
                })}
              />
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </Content>
    </Layout>
  );
};

export default AppointmentSlots;
