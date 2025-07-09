const express = require('express');
const router = express.Router();
const { getAttendeeList,createAttendee, exportAttendees } = require('../controllers/attendeeController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');

router.get('/getAttendeeList',authMiddleware,getAttendeeList);
router.post('/createAttendee',createAttendee);
router.get('/export', exportAttendees);

module.exports = router;