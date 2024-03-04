const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const messagesController = require("../controllers/messages-controller");

// Save new conversation to DB
router.post("/createconversation", messagesController.create_conversation);
// Save messages to DB
router.post("/savemessage", messagesController.save_message);
// Fetch list of conversations by userid
router.get(
  "/listconversations/:uid",
  messagesController.list_conversations_by_uid
);
// Fetch message history of conversation by conversation id
router.get(
  "/listmessagehistory/:cid",
  messagesController.list_message_history_by_cid
);
// Fetch user by uid
router.get("/getuser/:uid", messagesController.get_user_by_uid);

// Fetch list of all users
router.get("/listusers/:uid", messagesController.list_users);

http: module.exports = router;
