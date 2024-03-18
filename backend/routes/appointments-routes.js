const express = require("express");

const router = express.Router();

const appointmentController = require("../../backend/controllers/appointment-controller");
//const middlewares = require('../../middlewares');

//get all appointments
router.get("/:uid", appointmentController.findAllAppointments);

//add appointment
router.post("/addappointment", appointmentController.addAppointment);

//update appointment
router.put("/:id", appointmentController.editAppointment);

//delete appointment
router.delete("/:id", appointmentController.deleteAppointment);

// get list of doctors
router.get("/listdoctors", appointmentController.list_doctors);

// //get all appointments
// router.get('/', appointmentController.findAllAppointments);

// //add appointment
// router.post('/', middlewares.validateInput, middlewares.validateSlot, appointmentController.addAppointment);

// //update appointment
// router.put('/:id', middlewares.validateInput, middlewares.validateSlot, appointmentController.editAppointment);

// //delete appointment
// router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
