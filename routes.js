const express = require('express');
const router = express.Router();
const biomaxController = require('./controller');

router.post('/attendance-logs', biomaxController.fetchAttendanceLogs);

module.exports = router;
