const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userrouter = require('./routers/user_router');
const userdetailrouter = require('./routers/userdetail_router');
const seatregister_router = require('./routers/seatregister_routers');
const seatRoutes = require('./routers/cancelseat_router');
const connectToDb = require('./database/db');

const app = express();

// Connect to MongoDB
connectToDb();

// CORS options
const corsOptions = {
 origin: [
    'http://localhost:5173', 
    'https://client-of-seat-managemant-git-main-tarushi-s-projects.vercel.app',
    'https://client-of-seat-managemant.vercel.app',
    'https://client-of-seat-managemant-1mpy-git-main-tarushi-s-projects.vercel.app',
    'https://client-of-seat-managemant.vercel.app' // ✅ New deployment link added
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

// Routes
app.use('/user', userrouter);
app.use('/user', userdetailrouter);
app.use('/user', seatregister_router);
app.use('/user', seatRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;