const express = require('express');
const router = express.Router();
const { getAttendeeList,createAttendee } = require('../controllers/attendeeController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');

router.get('/getAttendeeList',authMiddleware,getAttendeeList);
router.post('/createAttendee',authMiddleware,createAttendee);

module.exports = router;