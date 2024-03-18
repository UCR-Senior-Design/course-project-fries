import React, { useState } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Form, Input, DatePicker, Switch, Button, Radio } from "antd";
import NavigationBar from "../../common/components/NavBar";
import styles from "../pages/Appointments.module.css";
import { useAuth } from "../../common/utils/auth";

const AppointmentForm = (props) => {
  const { userId } = useAuth();

  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const baseUrl = "http://localhost:5001/api/appointments";

  const descriptionChangeHandler = (event) => {
    setError("");
    setDescription(event.target.value);
  };

  const validateInput = () => {
    if (description === "") {
      setError("Description Required.");
      return false;
    } else {
      return true;
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const appointment_data = JSON.stringify({
      doctor_id: props.selectedDoc,
      patient_id: userId,
      date: props.date,
      time: props.time,
      description: description,
    });

    if (validateInput()) {
      fetch("http://localhost:5001/api/appointments/addappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: appointment_data,
      })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => console.error(error));
    }
  };

  return (
    <Form
      className={`${styles["appt-form"]} ${styles.AppointmentForm}`}
      onSubmit={submitHandler}
    >
      <div className={styles.text}>Enter the following information:</div>

      <Input
        className={styles.input}
        name="description"
        value={description}
        placeholder="Description"
        onChange={descriptionChangeHandler}
      />

      {error && <div className={styles.error}>{error}</div>}

      <Button className={styles.selectbutton} onClick={submitHandler}>
        Submit
      </Button>
    </Form>
  );
};

export default withRouter(AppointmentForm);
