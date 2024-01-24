const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const patientsController = require("../controllers/patients-controller");

// GET patient by uid
router.get("/:uid", patientsController.get_patient_by_uid);
// GET list of patients by doctor uid
router.get(
  "/patientlist/:doctor_id",
  patientsController.get_patientlist_by_dr_id
);
// POST patient
router.post(
  "/",
  [(check("firstname").not().isEmpty(), check("lastname").not().isEmpty())],
  patientsController.create_patient
);
// PATCH patient
router.patch("/:uid", patientsController.patch_patient);
// DELETE patient
router.delete("/:uid", patientsController.delete_patient);

module.exports = router;
