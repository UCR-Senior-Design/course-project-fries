const { UUID } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forum_schema = new Schema({
  creator: { type: String, required: true},
  headline: { type: String, required: true },
  initComment: { type: String, required: true},
  topic: { type: String, required: true },
  rating: { type: Number, default: 0},
  anon: { type: Boolean, required: true, default: false}
});

module.exports = mongoose.model("Forum", forum_schema);
