// const { UUID } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patient_schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  doctor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
});

module.exports = mongoose.model("Patient", patient_schema); // Model, schema
