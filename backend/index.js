const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = 5000;
const bodyParser = require("body-parser");
const routes = require('./routes/index.js');
const connectDB = require('./config/db.js');
const seeder = require('./seed/seed.js');
const eventseeder = require('./seed/eventseed.js')
const groupregistre = require('./seed/groupregisterseed.js')

dotenv.config();

// Setup middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
 
// Connect to DB
connectDB();      
// seeder(); 
// eventseeder();
// groupregistre();
 
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
  