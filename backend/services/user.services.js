const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

exports.updateUserPassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error('Old password is incorrect');
    }

    user.password = newPassword; 
    await user.save(); 

    return 'Password updated successfully';
};

exports.updateUserProfile = async (userId, name, file) => {
  const updateData = { name };

  if (file) {
    updateData.image = {
      data: file.buffer,
      contentType: file.mimetype,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    throw new Error('User not found');
  }

  let imageUrl = '';
  if (updatedUser.image?.data) {
    const base64 = updatedUser.image.data.toString('base64');
    imageUrl = `data:${updatedUser.image.contentType};base64,${base64}`;
  }

  return {
    name: updatedUser.name,
    email: updatedUser.email,
    imageUrl,
  };
};
