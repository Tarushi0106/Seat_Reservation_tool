import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import SeatRegister from './pages/seatregister';
import Register from './pages/register';
import Login from './pages/login';

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seatregister" element={<SeatRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
   
  );
}

export default App;