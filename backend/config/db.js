// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to:', process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;