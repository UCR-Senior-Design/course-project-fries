const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Patient = require("../models/patient");

let DUMMY_USERS = [
  {
    id: "p1",
    firstname: "Megan",
    lastname: "Chan",
    role: "doctor",
    doctor_id: "",
  },
  {
    id: "p2",
    firstname: "Patient A",
    lastname: "Lastname A",
    role: "patient",
    doctor_id: "p1",
  },
  {
    id: "p3",
    firstname: "Patient B",
    lastname: "Lastname B",
    role: "patient",
    doctor_id: "p1",
  },
  {
    id: "p4",
    firstname: "Patient C",
    lastname: "Lastname C",
    role: "patient",
    doctor_id: "p5",
  },
  {
    id: "p5",
    firstname: "Doctor A",
    lastname: "Lastname DrA",
    role: "doctor",
    doctor_id: "",
  },
];

// GET user by uid
const get_user_by_uid = (req, res, next) => {
  const user_id = req.params.uid;
  const user = DUMMY_USERS.find((p) => {
    return p.id == user_id;
  });
  if (!user) {
    return next(new HttpError("Could not find user by provided uid.", 404));
  }
  res.json({ user: user }); // {user:user} == {user}
};

// GET list of patients by doctor uid
const get_patientlist_by_dr_id = (req, res, next) => {
  const doctor_id = req.params.doctor_id;
  const patient_list = DUMMY_USERS.filter((p) => {
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
const create_user = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }

  const { id, firstname, lastname, role, doctor } = req.body;
  const { doctor_id } = doctor;
  const created_user = {
    id: uuidv4(),
    firstname,
    lastname,
    role,
    doctor_id,
  };

  DUMMY_USERS.push(created_user);
  res.status(201).json({ created_user });
};

// PATCH User
const patch_user = (req, res, next) => {
  const { firstname, lastname, doctor_id } = req.body;
  const user_id = req.params.uid;

  const updated_user = { ...DUMMY_USERS.find((p) => p.id == user_id) }; // Make a copy of user with given id
  const user_index = DUMMY_USERS.findIndex((p) => p.id === user_id); // Get index of user in DUMMY_USERS

  updated_user.firstname = firstname;
  updated_user.lastname = lastname;
  updated_user.doctor_id = doctor_id;

  DUMMY_USERS[user_index] = updated_user;

  if (!updated_user) {
    return next(new HttpError("Could not find user by provided uid.", 404));
  }

  res.status(200).json({ user: updated_user });
};

// DELETE User
const delete_user = (req, res, next) => {
  const user_id = req.params.uid;
  if (!DUMMY_USERS.find((p) => p.id === user_id)) {
    throw new HttpError("Could not find user", 404);
  }
  DUMMY_USERS = DUMMY_USERS.filter((p) => p.id !== user_id);
  res.status(200).json({ message: "Deleted user" });
};

// Export pointer to functions for router
exports.get_user_by_uid = get_user_by_uid;
exports.get_patientlist_by_dr_id = get_patientlist_by_dr_id;
exports.create_user = create_user;
exports.patch_user = patch_user;
exports.delete_user = delete_user;
