const express = require('express');
const router = express.Router();
const { getAttendeeList } = require('../controllers/attendeeController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');

router.get('/getAttendeeList',authMiddleware,getAttendeeList);

module.exports = router;