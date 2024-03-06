import React, { useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Form, Input, DatePicker, Switch, Button, Radio, Space, Table, Tag,} from 'antd';
import NavigationBar from "../../common/components/NavBar";
import styles from '../pages/Appointments.module.css';
import AppointmentForm from '../components/AppointmentForm';

const AppointmentSlots = (props) => {
  
  const [input, setInput] = useState({
    email: '',
    firstName: '',
    lastName: '',
    description: '',
    slotTime: '',
    slotDate: ''
  })
  const [AM, setAM] = useState(true);
  const [error, setError] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const slotsAM = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00'];
  const slotsPM = ['1:00-2:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'];
  const baseUrl = 'http://localhost:3000/appointments';

  const changeHandler = event => {
    setError('');
    setInput({
      ...input,
      [event.target.name]: event.target.value
    })
  }

  const switchHandler = () => {
    setError('');
    setAM(!AM);
  }

  const dateHandler = (date, datestring) => {
    setError('');
    setInput({
      ...input, 
      slotDate: date
    })
  }

  const validateInput = () => {
    if (!input.slotTime || !input.slotDate) {
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
            slotTime: '',
            slotDate: ''
          })
          props.history.push('/');
        })
        .catch(error => {
          console.log('error adding appointment:', error);
        })
    }
  }

  const checkHandler = () => {
    setShowTable(true);
  }

  const formHandler = () => {
    setShowForm(true);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Specialty',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: 'Select Doctor',
      key: 'action',
      render: (_, record) => (
        <Button className={styles.selectbutton} onClick={formHandler}>Select</Button>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      gender: 'Male',
      specialty: 'Family Doctor'
    },
    {
      key: '2',
      name: 'Karen White',
      gender: 'Female',
      specialty: 'Family Doctor'
    },
    {
      key: '3',
      name: 'John Brown',
      gender: 'Male',
      specialty: 'Family Doctor'
    },
  ];


  const Back = () => {
    window.location.href = "/appointments";
  };

  return (
    <Form className={`${styles['appt-form']} ${styles.AppointmentForm}`} onSubmit={submitHandler}>
      <header className={styles['App-header']}>
        <NavigationBar />
        <div className={styles.initText}>
          Let's make your appointment!
        </div>
        <div className={styles.text}>
          Select your preferred appointment time and confirm your date!
        </div>
      </header>
      <Switch checkedChildren="AM" unCheckedChildren="PM" defaultChecked onChange={switchHandler}/>
      {AM ? (
        <Radio.Group className={styles.radioGroup} name='slotTime' value={input.slotTime} onChange={changeHandler}>
          {slotsAM.map(item => <Radio key={item} value={`${item} AM`}>{`${item} AM`}</Radio>)}
        </Radio.Group>
      ) : (
        <Radio.Group className={styles.radioGroup} name='slotTime' value={input.slotTime} onChange={changeHandler}>
          {slotsPM.map(item => <Radio key={item} value={`${item} PM`}>{`${item} PM`}</Radio>)}
        </Radio.Group>
      )}
      
      <DatePicker className={styles.datePicker} onChange={dateHandler}></DatePicker>

      <Button className={styles.button} onClick={checkHandler}>Check Availability</Button>
      <Button className={styles.button} onClick={Back}>Back</Button>

      {showTable && (
      <div className={styles.text}>
        <p>
          Here are the available Doctors for your selected appointment day and time:
        </p>
        <Table columns={columns} dataSource={data} />
      </div>
    )}

      {showForm && <AppointmentForm />}

      {error && <div className={styles.error}>{error}</div>}
    </Form>
  )
  }

export default withRouter(AppointmentSlots);