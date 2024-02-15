const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const message_schema = new Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("Message", message_schema);
