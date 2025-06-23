const express = require('express');
const router = express.Router();
const { createEvent, getEventList, getEventCount, deletedEvet, editEvent, updateEventData } = require('../controllers/eventController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');


router.get('/count', authMiddleware, getEventCount);
router.get('/getEventList',authMiddleware, getEventList);
router.post('/createEvent',authMiddleware, createEvent); 
router.post('/deletedEvet',authMiddleware, deletedEvet); 
router.post('/editEvent',authMiddleware, editEvent); 
router.post('/updateEventData',authMiddleware, updateEventData); 

module.exports = router;
