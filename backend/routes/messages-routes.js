const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const messagesController = require("../controllers/messages-controller");

// Send request to start WS Server when messages main page is accessed
router.get("/", messagesController.handle_client_activity);
module.exports = router;
