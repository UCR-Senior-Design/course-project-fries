const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const forumController = require("../controllers/forum-controller");

// Post forums
router.post(
  "/",
  [(check("creator").not().isEmpty(), check("headline").not().isEmpty(), check("topic").not().isEmpty())],
  forumController.createForum
);

module.exports = router;
