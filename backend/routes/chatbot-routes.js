const express = require('express');
const router = express.Router();

const queryController = require('../controllers/chatbot-controller');

router.post('/query', queryController.query);

module.exports = router;
