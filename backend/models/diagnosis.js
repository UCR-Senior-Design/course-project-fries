const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileData: { type: Buffer, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
