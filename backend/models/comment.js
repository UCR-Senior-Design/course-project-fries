const { UUID } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const comment_schema = new Schema({
  creator: { type: String, required: true},
  forum_id: { type: String, required: true },
  comment_text: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", comment_schema);
