const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
 const userrouter = require('./routers/user_router');
 const userdetailrouter = require('./routers/userdetail_router');
  const seatregister_router = require('./routers/seatregister_routers');
  const seatRoutes = require('./routers/cancelseat_router');
  // const otprouter = require('./routers/otprouter');
const connectToDb = require('./database/db');

connectToDb();

const corsOptions = {
  origin: 'http://localhost:5175',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,               
  optionsSuccessStatus: 204        
};

app.use(cors(corsOptions));


app.options('*', cors(corsOptions)); 


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 app.use('/user', userrouter);
 app.use('/user', userdetailrouter);
 app.use('/user', seatregister_router);
  //  app.use('/user', otprouter);


app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;