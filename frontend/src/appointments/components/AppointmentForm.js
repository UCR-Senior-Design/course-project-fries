import React, { useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Form, Input, DatePicker, Switch, Button, Radio, } from 'antd';
import NavigationBar from "../../common/components/NavBar";
import styles from '../pages/Appointments.module.css';

const AppointmentForm = (props) => {
  
  const [input, setInput] = useState({
    email: '',
    firstName: '',
    lastName: '',
    description: '',
    //slotTime: '',
    //slotDate: ''
  })
  const [error, setError] = useState('')

  const baseUrl = 'http://localhost:3000/appointments';

  const changeHandler = event => {
    setError('');
    setInput({
      ...input,
      [event.target.name]: event.target.value
    })
  }


  const validateInput = () => {
    if (!input.email || !input.firstName || !input.lastName || !input.description) {
      setError('All fields are required');
      return false;
    } else {
      return true;
    }
  }

  const submitHandler = event => {
    event.preventDefault();
    if (validateInput()) {
      axios.post(`${baseUrl}/appointments`, input)
        .then(response => {
          console.log('success adding appointment:', response);
          setInput({
            email: '',
            firstName: '',
            lastName: '',
            description: '',
          })
          props.history.push('/');
        })
        .catch(error => {
          console.log('error adding appointment:', error);
        })
    }
  }


  return (
    <Form className={`${styles['appt-form']} ${styles.AppointmentForm}`} onSubmit={submitHandler}>
      <div className={styles.text}> 
        Enter the following information:
      </div>
    
      <Input className={styles.input} name='email' value={input.email} placeholder='Email' onChange={changeHandler} />
      <Input className={styles.input} name='firstName' value={input.firstName} placeholder='First name' onChange={changeHandler} />
      <Input className={styles.input} name='lastName' value={input.lastName} placeholder='Last name' onChange={changeHandler} />
      <Input className={styles.input} name='description' value={input.description} placeholder='Description' onChange={changeHandler} />
      
      {error && <div className={styles.error}>{error}</div>}
      
      <Button className={styles.selectbutton} onClick={submitHandler}>Submit</Button>
    </Form>
  )
  }

export default withRouter(AppointmentForm);