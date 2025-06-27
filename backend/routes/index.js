const express = require('express');

const app = express();
const router = express.Router();
const authRoutes = require('./auth.route.js');
const eventRoutes = require('./event.route.js'); 
const groupRoute = require('./group.route.js'); 
const webhookRoute = require('./webhook.route.js'); 
const attendeesRoute = require('./attendees.route.js');
const userRoute = require('./user.route.js');

router.use("/auth", authRoutes);

router.use("/user",userRoute)

router.use("/event", eventRoutes);

router.use("/group", groupRoute);

router.use("/attendees", attendeesRoute);

router.use("/webhook", webhookRoute);



module.exports = router;
