import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.endsWith('@ericsson.com')) {
      alert('Only users working in ericsson can register.');
      return;
    }

    const newUser = {
      firstname,
      lastname,
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const data = response.data;
        console.log('User registered successfully:', data);
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        console.error('Error registering user:', response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data.message || error.message}`);
    }

    setfirstname('');
    setlastname('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <form onSubmit={submitHandler}>
          <h3 className="title" style={{ fontSize: '2rem' }}>Sign Up</h3>

          <input
            id="firstname"
            required
            className="input"
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setfirstname(e.target.value)}
          />

          <input
            id="lastname"
            required
            className="input"
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setlastname(e.target.value)}
          />

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
            Create Account
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;