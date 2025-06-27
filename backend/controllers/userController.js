const Services = require('../services/user.services.js');
const User = require('../models/user.model.js');

exports.updatepassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;
        console.log(userId);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Both passwords are required' });
        }

        const message = await Services.updateUserPassword(userId, currentPassword, newPassword);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Password update failed' });
    }
};
exports.getUserProfile = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let imageUrl = '';
      if (user.image?.data && user.image?.contentType) {
        const base64 = user.image.data.toString('base64');
        imageUrl = `data:${user.image.contentType};base64,${base64}`;
      }
  
      res.json({
        name: user.name,
        email: user.email,
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error('Fetching user profile failed:', error);
      res.status(500).json({ message: 'Failed to get user profile' });
    }
  };
  
  exports.updateUser = async (req, res) => {
    try {
      const userId = req.user._id;
      const { name } = req.body;
      const file = req.file;
  
      const updatedUser = await Services.updateUserProfile(userId, name, file);
  
      res.json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (err) {
      console.error('Update failed:', err.message);
      res.status(500).json({ message: err.message || 'Server error' });
    }
  };