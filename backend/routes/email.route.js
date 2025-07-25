const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/auth.middleware.js');
const { getEmailList } = require('../controllers/emailController.js');

router.get('/getEmailList', getEmailList);

module.exports = router;