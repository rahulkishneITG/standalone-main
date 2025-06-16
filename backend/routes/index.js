const express = require('express');

const app = express();
const router = express.Router();
const authRoutes = require('./auth.route.js');
const eventRoutes = require('./event.route.js'); 
const groupRoute = require('./attendees.route.js'); 
const webhookRoute = require('./webhook.route.js'); 

router.use("/auth", authRoutes);

router.use("/event", eventRoutes);

router.use("/group", groupRoute);

router.use("/webhook", webhookRoute);



module.exports = router;
