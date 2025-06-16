const express = require('express');
const router = express.Router();
const { OrderWebhook } = require('../controllers/webhookController.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.get('/OrderWebhook', authMiddleware, OrderWebhook);


module.exports = router;