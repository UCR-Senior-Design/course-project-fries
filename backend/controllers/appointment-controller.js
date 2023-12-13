// Import necessary modules
const express = require('express');
const router = express.Router();

// Sample data - You would typically interact with a database here
let appointments = [
  { id: 1, title: "Meeting 1", date: "2023-01-01" },
  { id: 2, title: "Meeting 2", date: "2023-02-01" },
];

// Route to get all appointments
router.get("/", (req, res) => {
  res.json(appointments);
});

// Route to get a specific appointment by ID
router.get("/:id", (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const appointment = appointments.find(app => app.id === appointmentId);

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
  } else {
    res.json(appointment);
  }
});

// Route to create a new appointment
router.post("/", (req, res) => {
  const { title, date } = req.body;

  // Validate input
  if (!title || !date) {
    res.status(400).json({ error: "Title and date are required" });
    return;
  }

  // Create a new appointment
  const newAppointment = {
    id: appointments.length + 1,
    title,
    date,
  };

  appointments.push(newAppointment);

  res.status(201).json(newAppointment);
});

// Route to update an existing appointment
router.put("/:id", (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { title, date } = req.body;

  // Find the appointment to update
  const appointment = appointments.find(app => app.id === appointmentId);

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  // Update appointment details
  appointment.title = title || appointment.title;
  appointment.date = date || appointment.date;

  res.json(appointment);
});

// Route to delete an appointment
router.delete("/:id", (req, res) => {
  const appointmentId = parseInt(req.params.id);

  // Filter out the appointment to delete
  appointments = appointments.filter(app => app.id !== appointmentId);

  res.json({ message: "Appointment deleted successfully" });
});

// Export the router
module.exports = router;
