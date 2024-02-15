const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const messagesController = require("../controllers/messages-controller");

// Send request to start WS Server when messages main page is accessed
router.get("/", messagesController.handle_client_activity);
// Save new conversation to DB
router.post("/createconversation", messagesController.create_conversation);
// Save messages to DB
router.post("/savemessage", messagesController.save_message);

http: module.exports = router;
