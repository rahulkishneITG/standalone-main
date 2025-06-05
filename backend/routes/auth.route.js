const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/authControllers.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.post('/login', login);
router.get('/', authMiddleware, getUser);

module.exports = router;