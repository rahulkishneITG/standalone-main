const express = require('express');

const app = express();
const router = express.Router();
const authRoutes = require('./auth.route.js');

router.use("/auth", authRoutes);

module.exports = router;
