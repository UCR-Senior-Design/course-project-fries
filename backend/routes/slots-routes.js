const express = require('express');

const router = express.Router();

const slotController = require('../controllers/slot-controller');

//get all slots
// router.get('/', slotController.findAllSlots);
router.get('/slots', slotController.findAllSlots);

//get slot by id
//router.get('/', slotController.findSlotsByDate);

router.get('/:id', slotController.findSlotById);

module.exports = router;