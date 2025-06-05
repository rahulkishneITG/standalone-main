// seed/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model.js');

dotenv.config(); 

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      const users = [
        { name: 'Admin One', email: 'admin1@gmail.com', password: 'admin123@' },
        { name: 'Admin Two', email: 'admin2@gmail.com', password: 'admin123@' },
        { name: 'Admin Three', email: 'admin3@gmail.com', password: 'admin123@' },
        { name: 'Admin Four', email: 'admin4@gmail.com', password: 'admin123@' },
        { name: 'Admin Five', email: 'admin5@gmail.com', password: 'admin123@' },
      ];

      for (const userData of users) {
        const user = new User(userData);
        await user.save(); 
      }
      console.log('✅ Admin users seeded!');
    } else {
      console.log('ℹ️ Admin users already exist.');
    }
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

module.exports = seedUsers;