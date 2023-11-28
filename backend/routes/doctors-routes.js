const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const doctorsController = require("../controllers/doctors-controller");

// GET patient by uid
router.get("/:ujid", doctorsController.get_doctor_by_id);
// GET list of patients by doctor uid
router.get(
  "/patientlist/:doctor_id",
  doctorsController.get_patientlist_by_dr_id
);
// POST doctor
router.post(
  "/",
  [(check("firstname").not().isEmpty(), check("lastname").not().isEmpty())],
  doctorsController.create_doctor
);
// PATCH doctor
router.patch("/:uid", doctorsController.patch_doctor);
// DELETE doctor
router.delete("/:uid", doctorsController.delete_doctor);

module.exports = router;
