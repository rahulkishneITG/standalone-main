const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/auth.middleware.js');
const { creategroup } = require('../controllers/groupmemberController.js');    

router.post('/createGroupmeber',authMiddleware,creategroup);

module.exports = router;