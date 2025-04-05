import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth token or session data
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>🎟️ Seat Selection Tool</h1>
        <div className="logout-container">
  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>

        <p>Choose your seat with ease and comfort</p>
      </header>

      <div className="content">
        <div className="info-box">
          <h2>📋 How It Works</h2>
          <p>
            Select your preferred seat by clicking on the available options. 
            Once confirmed, you can proceed to checkout.
          </p>
        </div>

        <div className="actions">
          <Link to="/seatregister" className="btn primary">
            Select Seats
          </Link>
          <Link to="/about" className="btn secondary">
            Learn More
          </Link>
        </div>
      </div>

      <footer className="footer">
        &copy; 2024 Seat Selection Tool. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
