const User = require("../models/Users");
const Diagnosis = require("../models/diagnosis");


exports.upload = async (req, res) => {
  const {patient_firstname, patient_lastname, doctor_firstname, doctor_lastname} = req.body;
  const fileList = req.files;

  // console.log(req.body);
  // console.log(req.files);

  try {
    const patient = await User.findOne({firstname: patient_firstname, lastname: patient_lastname});
    const doctor = await User.findOne({firstname: doctor_firstname, lastname: doctor_lastname});

    if (!patient || patient.isDoctor) {
      return res.status(404).json({error: 'Patient not found'});
    }

    if (!doctor || !doctor.isDoctor) {
      return res.status(404).json({error: 'Doctor not found'});
    }

    const diagnoses = fileList.map((file) => ({
      patient: patient._id,
      doctor: doctor._id,
      fileData: file.path,
      fileName: file.originalname,
      fileType: file.mimetype,
    }));

    const insertResult = await Diagnosis.insertMany(diagnoses);
    const diagnosisIds = insertResult.map(diagnosis => diagnosis._id);

    patient.diagnoses.push(...diagnosisIds);
    await patient.save();

    doctor.diagnoses.push(...diagnosisIds);
    await doctor.save();

    res.status(200).json({message: 'Files uploaded successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
}
