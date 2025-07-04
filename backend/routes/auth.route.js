const express = require('express');
const router = express.Router();
const { login,verifyToken,getUser } = require('../controllers/authControllers.js');


router.post('/login', login);
router.get('/me', verifyToken,getUser);
router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});

module.exports = router;