const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  doctor_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true 
  },
  patient_id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: {type: String, required: true},
});

module.exports = mongoose.model("Appointment", appointmentSchema);