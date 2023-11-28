const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

// GET user by uid
const get_doctor_by_id = async (req, res, next) => {
  const doctor_id = req.params.uid;

  let doctor;
  try {
    doctor = await Doctor.findById(doctor_id);
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error); // stop code execution if error is detected
  }

  if (!doctor) {
    const error = new HttpError("Could not find doctor by provided id.", 404);
    return next(error);
  }
  res.json({ doctor: doctor.toObject({ getters: true }) });
};

// GET list of patients by doctor uid
const get_patientlist_by_dr_id = async (req, res, next) => {
  const doctor_id = req.params.doctor_id;
  let patient_list;

  try {
    patient_list = await Patient.find({ doctor_ids: doctor_id });
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error);
  }

  if (!patient_list) {
    const error = new HttpError(
      "Could not find patient list by provided doctor id.",
      404
    );
    return next(error);
  }

  res.json({
    patient_list: patient_list.map((patient) =>
      patient.toObject({ getters: true })
    ),
  });
};

// POST User
const create_doctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }

  const { firstname, lastname, username, password, email } = req.body;
  const created_doctor = new Doctor({
    firstname,
    lastname,
    username,
    password,
    email,
  });

  try {
    await created_doctor.save(); // Mongoose method to store document in DB, create unique userid
  } catch (err) {
    const error = new HttpError("Creating User failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ created_doctor });
};

// PATCH User
const patch_doctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { firstname, lastname, username, password } = req.body;
  const doctor_id = req.params.uid;

  let doctor;
  try {
    doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      const error = new HttpError("Doctor not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Updating User failed, please try again", 500);
    return next(error);
  }

  doctor.firstname = firstname;
  doctor.lastname = lastname;
  doctor.username = username;
  doctor.password = password;

  try {
    await doctor.save();
  } catch (err) {
    const error = new HttpError("Updating User failed, please try again", 500);
    return next(error);
  }

  res.status(200).json({ doctor: doctor.toObject({ getters: true }) });
};

// DELETE User
const delete_doctor = async (req, res, next) => {
  const doctor_id = req.params.uid;

  let doctor;
  try {
    doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      const error = new HttpError("Doctor not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Deleting User failed! please try again", 500);
    return next(error);
  }

  try {
    await doctor.deleteOne();
  } catch (err) {
    console.log();
    const error = new HttpError(
      "Deleting User failed... please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted user." });
};

// Export pointer to functions for router
exports.get_doctor_by_id = get_doctor_by_id;
exports.get_patientlist_by_dr_id = get_patientlist_by_dr_id;
exports.create_doctor = create_doctor;
exports.patch_doctor = patch_doctor;
exports.delete_doctor = delete_doctor;
