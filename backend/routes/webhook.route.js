const express = require('express');
const router = express.Router();
const { OrderWebhook } = require('../controllers/webhookController.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const { verifyShopifyWebhook } = require('../middleware/verifyWebhook.js');

router.post('/OrderWebhook',verifyShopifyWebhook);


module.exports = router;