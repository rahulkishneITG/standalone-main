const express = require('express');
const router = express.Router();

const { updatepassword, getUserProfile, updateUser } = require('../controllers/userController.js');
const authMiddleware = require('../middleware/auth.middleware.js');
const upload = require('../middleware/upload.middleware.js');

router.post("/updatepassword", authMiddleware, updatepassword);
router.get("/getuser", authMiddleware, getUserProfile);

router.put("/updateuser", authMiddleware, upload.single('image'), updateUser);

module.exports = router;
