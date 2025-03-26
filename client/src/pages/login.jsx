import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();


    const userData = {
      email,
      password,
    };

    try {
        const response = await axios.post('https://seat-reservation-tool.onrender.com//user/login', userData, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, 
          });
      

      if (response.status === 200) {
        const data = response.data;
        console.log('User logged in successfully:', data);
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        console.error('Error logging in user:', response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error logging in user:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data.message || error.message}`);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={submitHandler}>
          <h3 className="title" style={{ fontSize: '2rem' }}>Log In</h3>

          <input
            id="email"
            required
            className="input"
            type="email"
            placeholder="email@ericsson.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            id="password"
            className="input"
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="submit-btn">
            Log In
          </button>
        </form>

        <p className="footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="login-link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;