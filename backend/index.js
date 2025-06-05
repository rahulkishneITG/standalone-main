const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = 5000;
const bodyParser = require("body-parser");
const routes = require('./routes/index.js');
const connectDB = require('./config/db.js');
const seeder = require('./seed/seed.js');

dotenv.config();

// Setup middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
 
// Connect to DB
connectDB();      
seeder(); 
 
// Routes
app.use("/api", routes);
 
// Test route
app.use("/", (req, res) => {
  res.send("Yes, now you can hit APIs");
});
 
// Start the server
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});