const express = require('express');
const router = express.Router();
const { walkinList } = require('../controllers/walkinController.js');
const  authMiddleware  = require('../middleware/auth.middleware.js');

router.get('/walkinList', authMiddleware, walkinList);
router.get('/walkinList/:walkinId', authMiddleware, walkinList);

module.exports = router;