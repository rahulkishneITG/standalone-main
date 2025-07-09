const express = require('express');
const router = express.Router();
const { createEvent, getEventList, getEventCount, deletedEvent, editEvent, updateEventData, eventDetails } = require('../controllers/eventController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');
const syncProduct = require('../controllers/syncProductController.js');


router.get('/count', authMiddleware, getEventCount);
router.get('/getEventList',authMiddleware, getEventList);
router.post('/createEvent',authMiddleware, createEvent); 
router.delete('/deletedEvent/:delId',authMiddleware, deletedEvent); 
router.get('/editEvent/:editId',authMiddleware, editEvent); 
router.put('/updateEventData/:updateId',authMiddleware, updateEventData); 
router.get("/syncproduct",authMiddleware,syncProduct);
router.post("/eventDetails",eventDetails);
module.exports = router;
