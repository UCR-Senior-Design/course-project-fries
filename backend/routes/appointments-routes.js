const express = require("express");

const router = express.Router();

const appointmentController = require("../../backend/controllers/appointment-controller");
//const middlewares = require('../../middlewares');

//get all appointments
router.get("/viewappointments/:uid", appointmentController.findAllAppointments);

//add appointment
router.post("/addappointment", appointmentController.addAppointment);

//update appointment
router.put("/:id", appointmentController.editAppointment);

//delete appointment
router.delete(
  "/deleteappointment/:id",
  appointmentController.deleteAppointment
);

// get list of doctors
router.get("/listdoctors", appointmentController.list_doctors);

module.exports = router;
