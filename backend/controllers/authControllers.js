const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Services = require('../services/auth.services.js');


exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }



    const user = await Services.getUserForLogin(email, password, rememberMe);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const ismatchedPassword = await Services.ismatchPassword(password, user);
    console.log('Password match:', ismatchedPassword);
    if (!ismatchedPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const generatedToken = await Services.generateToken(user, rememberMe);
    if (!generatedToken) {
      return res.status(500).json({ message: 'Error generating token' });
    }
    const token = generatedToken;
    console.log('Generated Token:', token);

     res.json({ token,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        } 
      });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }

};





exports.getUser = async (req, res) => {

console.log('Request body:', req.body.userId);
  try {
    const  id  = req.body.userId;
    console.log('Request body:', id);
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Fetching user for ID:', id);
    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


