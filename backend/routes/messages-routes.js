const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const messagesController = require("../controllers/messages-controller");

// // GET user by uid
// router.get("/:uid", messagesController.get_user_by_uid);
// // GET list of patients by doctor uid
// router.get(
//   "/patientlist/:doctor_id",
//   messagesController.get_patientlist_by_dr_id
// );
// // POST user
// router.post(
//   "/",
//   [(check("name").not().isEmpty(), check("role").not().isEmpty())],
//   messagesController.create_user
// );
// // PATCH user
// router.patch("/:uid", messagesController.patch_user);
// // DELETE user
// router.delete("/:uid", messagesController.delete_user);

module.exports = router;
