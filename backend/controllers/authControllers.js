const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
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
    
    if (!ismatchedPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const generatedToken = await Services.generateToken(user, rememberMe);
    if (!generatedToken) {
      return res.status(500).json({ message: 'Error generating token' });
    }
    const token = generatedToken;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

     res.json({ token,
        userData: {
          _id: user._id,
          name: user.name,
          email: user.email,
        } 
      });
  } catch (error) {
   
    res.status(500).json({ message: 'Server error', error: error.message });
  }

};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ userData: user });
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded); 
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};
