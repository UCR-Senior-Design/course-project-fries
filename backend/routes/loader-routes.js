const express = require("express");
const multer = require("multer");
const upload = multer({dest: '../uploads/'});
// const upload = multer({storage: multer.memoryStorage()});

const loaderController = require("../controllers/loader-controller");
// const preloaderController = require("../controllers/preload-controller");

const router = express.Router();

router.post('/upload', upload.array('fileList'), loaderController.upload);
// router.post('/pre-upload', upload.array('fileList'), preloaderController.pre_upload);

// const patient = await User.findById(patientId).populate('diagnoses');
// const diagnoses = patient.diagnoses;

module.exports = router;
