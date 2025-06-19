const express = require('express');
const router = express.Router();
const { createEvent, getEventList, getEventCount, getEventById } = require('../controllers/eventController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');


router.get('/count', authMiddleware, getEventCount);
router.get('/events', authMiddleware, getEventList);
router.post('/createEvent',authMiddleware, createEvent);

module.exports = router;
