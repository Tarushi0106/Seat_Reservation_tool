import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Userdetails from './pages/userdetails';
import Seatregister from './pages/seatregister';
import Seatcancellation from './pages/seatcancellation';
import Register from './pages/register';
import Login from './pages/login';
import Thankyoupage from './pages/thankyoupage';

const App = () => {
  return (
  
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/userdetails" element={<Userdetails />} />
        <Route path="/seatregister" element={<Seatregister />} />
        <Route path="/seatcancellation" element={<Seatcancellation />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/thankyoupage" element={<Thankyoupage />} />
      </Routes>
   
  );
};

export default App;
