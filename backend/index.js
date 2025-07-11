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
const groupregistre = require('./seed/groupregisterseed.js');
const { verifyShopifyWebhook } = require('./middleware/verifyWebhook.js');
const { OrderWebhook } = require('./controllers/webhookController.js');

dotenv.config();
const allowedOrigins = {
  development: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://store.centerforholisticmedicine.com',
    'https://siddhi-test.myshopify.com'
  ],
  production: [
    'https://standalone-main.vercel.app',
    'https://store.centerforholisticmedicine.com',
    'https://siddhi-test.myshopify.com'
  ],
};
// Setup middlewares
app.post(
  '/api/webhook/OrderWebhook',
  express.raw({ type: 'application/json' }), 
  verifyShopifyWebhook,
  OrderWebhook
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors({
//   origin: allowedOrigins[process.env.NODE_ENV] || '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(cors({
  origin: function (origin, callback) {
    const allowed = allowedOrigins[process.env.NODE_ENV] || [];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// app.use(express.raw({ type: "application/json" }));
 
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
  