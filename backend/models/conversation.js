const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversation_schema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: { type: String, required: true },
  last_timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("Conversation", conversation_schema);
