const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversation_schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  title: { type: String, required: true },
});

module.exports = mongoose.model("Conversation", conversation_schema);
