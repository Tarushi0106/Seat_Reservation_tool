import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@ericsson.com')) {
      alert('Only users working in Ericsson can register.');
      return;
    }

    const newUser = { firstname, lastname, email, password };

    try {
      const response = await axios.post(
        'https://seat-reservation-tool.onrender.com/user/register',
        newUser,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        const data = response.data;
        console.log('User registered successfully:', data);
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data.message || error.message}`);
    }

    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={submitHandler}>
          <h3 className="title" style={{ fontSize: '2rem' }}>Sign Up</h3>

          <input
            required
            className="input"
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />

          <input
            required
            className="input"
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />

          <input
            required
            className="input"
            type="email"
            placeholder="email@ericsson.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* <button
            type="button"
            className={`otp-btn ${email ? 'active' : ''}`}
            onClick={handleSendOtp}
          >
            Send OTP
          </button> */}

          {/* <input
            required
            className="input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          /> */}

          <input
            required
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{' '}
          <Link to="/login" className="login-link">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;