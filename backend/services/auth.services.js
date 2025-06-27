const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.getUserForLogin = async (email, password, rememberMe) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  try {
    const user = await User.findOne({ email }).select('+password');
   
    if (!user) {
      return null; // invalid credentials, handle in controller
    }
    return user;
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error('Error fetching user');
  }
};



exports.generateToken = async (user, rememberMe) => {
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: rememberMe ? '7d' : '1h',
        });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        return null;
    }
};


exports.ismatchPassword = async (password, user) => {   
    console.log( await user.matchPassword(password));
    try {
        if (!user || !user.password) {
            throw new Error('User or password not found');
        }
    } catch (error) {
        console.error('Error checking password:', error);
        throw new Error('Error checking password');
    }
    return await user.matchPassword(password);
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
