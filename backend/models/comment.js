const { UUID } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const comment_schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  firstname: { type: String, required: true },
  forum: { type: Schema.Types.ObjectId, ref: 'Forum', required: true },
  comment_text: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now },
  rating: { type: Number, default: 0},
  anon: { type: Boolean, default: false},
  isDoctor: { type: Boolean, default: false}
});

module.exports = mongoose.model("Comment", comment_schema);
