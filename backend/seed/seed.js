const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model.js');
const axios = require('axios');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      const imageUrls = [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
      ];

      const users = [
        { name: 'Admin One', email: 'admin1@gmail.com', password: 'admin123@' },
        { name: 'Admin Two', email: 'admin2@gmail.com', password: 'admin123@' },
        { name: 'Admin Three', email: 'admin3@gmail.com', password: 'admin123@' },
        { name: 'Admin Four', email: 'admin4@gmail.com', password: 'admin123@' },
        { name: 'Admin Five', email: 'admin5@gmail.com', password: 'admin123@' },
      ];

      for (let i = 0; i < users.length; i++) {
        const imageResponse = await axios.get(imageUrls[i], {
          responseType: 'arraybuffer',
        });

        const userData = {
          ...users[i],
          image: {
            data: Buffer.from(imageResponse.data),
            contentType: imageResponse.headers['content-type'],
          },
        };

        const user = new User(userData);
        await user.save();
      }

      console.log('✅ Admin users seeded with profile images!');
    } else {
      console.log('ℹ️ Admin users already exist.');
    }
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

module.exports = seedUsers;
