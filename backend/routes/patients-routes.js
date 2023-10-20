const express = require('express');

const router = express.Router();

const DUMMY_PATIENTS = [
    {
        id: 'p1',
        title: 'kirin ichiban',
        description: 'delicious',
        doctor: {
            doctor_name: 'jack daniels'
        },
        ailment: 'thirsty'
    }
];

router.get('/:pid', (req, res, next) => {
    const patientId = req.params.pid;
    const patient = DUMMY_PATIENTS.find(p => {
        return p.id === patientId;
    });
    res.json({patient});
});

module.exports = router;