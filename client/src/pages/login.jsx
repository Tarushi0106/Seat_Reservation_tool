import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@ericsson.com')) {
      alert('Only users with @ericsson.com email can log in.');
      return;
    }

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User logged in successfully:', data);

        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        navigate('/seatregister');
      } else {
        console.error('Error logging in:', await response.text());
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={submitHandler}>
          <h3 className="title" style={{ fontSize: '2rem' }}>Login</h3>

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
            Login
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
