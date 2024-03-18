const HttpError = require("../models/http-error");
const moment = require("moment");
const User = require("../models/Users");
const appointmentModel = require("../models/appointments");
const slotModel = require("../models/slots");

const findAllAppointments = async (req, res, next) => {
  const uid = req.params.uid;
  let appt_list;
  try {
    appt_list = await appointmentModel.find({ patient_id: uid });

    if (appt_list.length === 0) {
      const error = new HttpError(
        "Could not find any existing appointments.",
        404
      );
      return next(error);
    }
    const appointmentsWithDoctorNames = await Promise.all(
      appt_list.map(async (appt) => {
        const { _id, doctor_id, date, time, description } = appt.toObject({
          getters: true,
        });
        //Get doctor fullname
        const doc = await User.findById(doctor_id); // Wait for the promise to resolve
        if (!doc) return null; // If no doctor found, return null
        const fullname = doc.firstname + " " + doc.lastname;
        return {
          _id: _id,
          doctor_id: doctor_id,
          date: date,
          time: time,
          description: description,
          doctor_name: fullname,
        };
      })
    );

    // Filter out null items (if any)
    const filteredAppointments = appointmentsWithDoctorNames.filter(
      (item) => item !== null
    );

    res.json({ appt_list: filteredAppointments });
  } catch (err) {
    const error = new HttpError(
      "An error occurred while retrieving the list of appointments.",
      500
    );
    return next(error);
  }
};

const addAppointment = async (req, res, next) => {
  const { doctor_id, patient_id, date, time, description } = req.body;

  const dateOnly = date.slice(0, 10);
  console.log(dateOnly);

  console.log(req.body);
  const newAppointment = new appointmentModel({
    doctor_id: doctor_id,
    patient_id: patient_id,
    date: dateOnly,
    time: time,
    description: description,
  });

  try {
    await newAppointment.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Appointment failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ newAppointment });
};

function editAppointment(req, res) {
  const id = req.params.id;
  const input = req.body;

  appointmentModel.findOne({ _id: id }, (error, data) => {
    if (error) {
      res.status(500).json({
        message: "error fetching appointment",
        error: error,
      });
    } else if (!data) {
      res.status(404).json({
        message: "no appointment of such id exists",
      });
    }

    const updatedAppointment = data;
    updatedAppointment.email = input.email;
    updatedAppointment.firstName = input.firstName;
    updatedAppointment.lastName = input.lastName;
    updatedAppointment.slots = input.slots;

    updatedAppointment.save((error1, data1) => {
      if (error1) {
        res.status(500).json({
          message: "error updating appointment",
          error: error1,
        });
      } else {
        res.status(201).json(data1);
      }
    });
  });
}

function deleteAppointment(req, res) {
  const id = req.params.id;

  appointmentModel.findOneAndRemove({ _id: id }, (error, data) => {
    if (error) {
      res.status(500).json({
        message: "error deleting appointment",
        error: error,
      });
    } else if (!data) {
      res.status(404).json("no appointment of such id exists");
    } else {
      res.status(200).json({ removed: data });
    }
  });
}

const list_doctors = async (req, res, next) => {
  let doctors_list;
  let unavailable_doc;
  const { data } = req.query;
  const { date, time } = JSON.parse(data);
  const dateOnly = date.slice(0, 10);

  // Return list of doctors in an array
  try {
    // Get all doctors
    doctors_list = await User.find({ isDoctor: true });
    // Get doctor_ids of unavailable doctors (have entries with selected date/time)
    const unavailable_list = await appointmentModel.find({
      date: dateOnly,
      time: time,
    });
    unavailable_doc = unavailable_list.map((appointment) =>
      appointment.doctor_id.toString()
    );
    console.log(unavailable_doc);
  } catch (err) {
    const error = new HttpError(
      "An error occurred while retrieving the list of doctors.",
      500
    );
    return next(error);
  }

  if (!doctors_list) {
    const error = new HttpError(
      "Could not find any doctors to add to doctors list.",
      404
    );
    return next(error);
  }

  res.json({
    doctors_list: doctors_list
      .map((user) => {
        const { _id, firstname, lastname } = user.toObject({ getters: true });
        const fullname = firstname + " " + lastname;
        // Filter unavailable doctors from returned doctors_list
        if (!unavailable_doc.includes(_id.toString())) {
          return { doc_id: _id, doc_name: fullname };
        }
        return null;
      })
      .filter((item) => item !== null),
  });
};

module.exports = {
  findAllAppointments,
  addAppointment,
  editAppointment,
  deleteAppointment,
  list_doctors,
};
