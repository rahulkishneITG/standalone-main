const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');




exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  console.log('Login request:', { email, password, rememberMe });
  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('User:', user, 'Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


