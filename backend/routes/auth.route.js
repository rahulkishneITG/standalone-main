const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authControllers.js');


router.post('/login', login);

module.exports = router;