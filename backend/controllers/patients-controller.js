const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Patient = require("../models/patient");

// GET user by uid
const get_patient_by_uid = async (req, res, next) => {
  const patient_id = req.params.uid;

  let patient;
  try {
    patient = await Patient.findById(patient_id);
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error); // stop code execution if error is detected
  }

  if (!patient) {
    const error = new HttpError("Could not find patient by provided id.", 404);
    return next(error);
  }
  res.json({ patient: patient.toObject({ getters: true }) });
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

// POST Patient
const create_patient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }

  const { firstname, lastname, username, password, email, doctor_ids } =
    req.body;
  const created_patient = new Patient({
    firstname,
    lastname,
    username,
    password,
    email,
    doctor_ids,
  });

  try {
    await created_patient.save(); // Mongoose method to store document in DB, create unique userid
  } catch (err) {
    const error = new HttpError("Creating User failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ created_patient });
};

// PATCH User
const patch_patient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { firstname, lastname, username, password } = req.body;
  const patient_id = req.params.uid;

  let patient;
  try {
    patient = await Patient.findById(patient_id);
    if (!patient) {
      const error = new HttpError("Patient not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Updating User failed, please try again", 500);
    return next(error);
  }

  patient.firstname = firstname;
  patient.lastname = lastname;
  patient.username = username;
  patient.password = password;

  try {
    await patient.save();
  } catch (err) {
    const error = new HttpError("Updating User failed, please try again", 500);
    return next(error);
  }

  res.status(200).json({ patient: patient.toObject({ getters: true }) });
};

// DELETE User
const delete_patient = async (req, res, next) => {
  const patient_id = req.params.uid;

  let patient;
  try {
    patient = await Patient.findById(patient_id);
    if (!patient) {
      const error = new HttpError("Patient not found", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Deleting User failed! please try again", 500);
    return next(error);
  }

  try {
    await patient.deleteOne();
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
exports.get_patient_by_uid = get_patient_by_uid;
exports.get_patientlist_by_dr_id = get_patientlist_by_dr_id;
exports.create_patient = create_patient;
exports.patch_patient = patch_patient;
exports.delete_patient = delete_patient;
