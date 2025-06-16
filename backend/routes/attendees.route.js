const express = require('express');
const router = express.Router();
const { creategroup } = require('../controllers/groupmemberController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');

router.post('/createGroupmeber',authMiddleware,creategroup);

module.exports = router;