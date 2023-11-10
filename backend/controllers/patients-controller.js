const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Patient = require("../models/patient");

let DUMMY_PATIENTS = [
  {
    id: "p1",
    firstname: "Megan",
    lastname: "Chan",
    username: "1",
    password: "1",
    email: "test@gmail.com",
    doctor_id: "",
  },
  {
    id: "p2",
    firstname: "Patient A",
    lastname: "Lastname A",
    username: "2",
    password: "2",
    email: "test@gmail.com",
    doctor_id: "p1",
  },
  {
    id: "p3",
    firstname: "Patient B",
    lastname: "Lastname B",
    username: "3",
    password: "3",
    email: "test@gmail.com",
    doctor_id: "p1",
  },
  {
    id: "p4",
    firstname: "Patient C",
    lastname: "Lastname C",
    password: "4",
    password: "4",
    email: "test@gmail.com",
    doctor_id: "p5",
  },
  {
    id: "p5",
    firstname: "Doctor A",
    lastname: "Lastname DrA",
    username: "5",
    password: "5",
    email: "test@gmail.com",
    doctor_id: "",
  },
];

// GET user by uid
const get_patient_by_uid = (req, res, next) => {
  const patient_id = req.params.uid;
  const patient = DUMMY_PATIENTS.find((p) => {
    return p.id == patient_id;
  });
  if (!patient) {
    return next(new HttpError("Could not find patient by provided uid.", 404));
  }
  res.json({ patient: patient }); // {user:user} == {user}
};

// GET list of patients by doctor uid
const get_patientlist_by_dr_id = (req, res, next) => {
  const doctor_id = req.params.doctor_id;
  const patient_list = DUMMY_PATIENTS.filter((p) => {
    return p.doctor_id === doctor_id;
  });

  if (!patient_list || patient_list.length === 0) {
    return next(
      new HttpError("Could not find patients list for provided doctor id.", 404)
    );
  }

  res.json({ patient_list });
};

// POST User
const create_patient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }

  const { firstname, lastname, username, password, email, doctor_id } =
    req.body;
  const created_patient = new Patient({
    firstname,
    lastname,
    username,
    password,
    email,
    doctor_id,
  });

  try {
    await created_patient.save(); // Mongoose method to store document in DB, create unique userid
  } catch (err) {
    const error = new HttpError("Creating User failed, please try again", 500);
    return next(error); // Stop code execution after error
  }

  res.status(201).json({ created_patient });
};

// PATCH User
const patch_patient = (req, res, next) => {
  const { firstname, lastname, username, password, doctor_id } = req.body;
  const patient_id = req.params.uid;

  const updated_patient = { ...DUMMY_PATIENTS.find((p) => p.id == patient_id) }; // Make a copy of user with given id
  const user_index = DUMMY_PATIENTS.findIndex((p) => p.id === patient_id); // Get index of user in DUMMY_USERS

  updated_patient.firstname = firstname;
  updated_patient.lastname = lastname;
  updated_patient.doctor_id = doctor_id;

  DUMMY_PATIENTS[user_index] = updated_patient;

  if (!updated_patient) {
    return next(new HttpError("Could not find user by provided uid.", 404));
  }

  res.status(200).json({ user: updated_patient });
};

// DELETE User
const delete_patient = (req, res, next) => {
  const patient_id = req.params.uid;
  if (!DUMMY_PATIENTS.find((p) => p.id === patient_id)) {
    throw new HttpError("Could not find user", 404);
  }
  DUMMY_PATIENTS = DUMMY_PATIENTS.filter((p) => p.id !== patient_id);
  res.status(200).json({ message: "Deleted user" });
};

// Export pointer to functions for router
exports.get_patient_by_uid = get_patient_by_uid;
exports.get_patientlist_by_dr_id = get_patientlist_by_dr_id;
exports.create_patient = create_patient;
exports.patch_patient = patch_patient;
exports.delete_patient = delete_patient;
