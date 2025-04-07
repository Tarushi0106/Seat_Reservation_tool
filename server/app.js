const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routers
const userrouter = require('./routers/user_router');
const userdetailrouter = require('./routers/userdetail_router');
const seatregister_router = require('./routers/seatregister_routers');
const seatRoutes = require('./routers/cancelseat_router');

// MongoDB connection
const connectToDb = require('./database/db');

const app = express();

// Connect to DB
connectToDb();

// Allowed client origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://client-of-seat-managemant-git-main-tarushi-s-projects.vercel.app',
  'https://client-of-seat-managemant.vercel.app',
  'https://client-of-seat-managemant-1mpy-git-main-tarushi-s-projects.vercel.app',
  'https://client-of-seat-managemant-tarushi-s-projects.vercel.app'
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS
app.use(cors(corsOptions));

// Enable preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/user', userrouter);
app.use('/user', userdetailrouter);
app.use('/user', seatregister_router);
app.use('/user', seatRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World from Seat Management Tool Backend!');
});

module.exports = app;
