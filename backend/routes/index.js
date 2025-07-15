const express = require('express');

const app = express();
const router = express.Router();
const authRoutes = require('./auth.route.js');
const eventRoutes = require('./event.route.js'); 
const groupRoute = require('./group.route.js'); 
const attendeesRoute = require('./attendees.route.js');
const userRoute = require('./user.route.js');
const walkRoute = require('./walkin.route.js');
const emailRoute = require('./email.route.js');
const { sendEmailController } = require('../controllers/sendEmailController.js');


router.use("/auth", authRoutes);

router.use("/user",userRoute)

router.use("/event", eventRoutes);

router.use("/group", groupRoute);

router.use("/walkin", walkRoute);

router.use("/attendees", attendeesRoute);

router.use("/email", emailRoute);

router.use("/send-email",sendEmailController)

module.exports = router;
