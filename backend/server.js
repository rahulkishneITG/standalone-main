const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth.route.js');
const connectDB = require('./config/db.js');
const seeder = require('./seed/seed.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();      
    await seeder();     
    app.use('/api/auth', authRoutes);

    app.listen(5000, () => console.log(`Server running on port 5000`));
  } catch (err) {
    console.error('Startup Error:', err);
    process.exit(1);
  }
};

startServer();
