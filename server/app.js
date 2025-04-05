const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routers/user_router');
const userDetailRouter = require('./routers/userdetail_router');
const seatRegisterRouter = require('./routers/seatregister_routers');
const cancelSeatRouter = require('./routers/cancelseat_router');

const connectToDb = require('./database/db');

const app = express();

// Connect to MongoDB
connectToDb();

// CORS options
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://client-of-seat-managemant-git-main-tarushi-s-projects.vercel.app',
    'https://client-of-seat-managemant.vercel.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Register Routes
app.use('/user', userRouter);
app.use('/user', userDetailRouter);
app.use('/user', seatRegisterRouter);
app.use('/user', cancelSeatRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;
