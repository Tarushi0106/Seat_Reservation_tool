import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      alert('Only users with @ericsson.com email can register.');
      return;
    }

    const newUser = {
      firstname: firstname,
      lastname: lastname,
      email,
      password,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
console.log(newUser);
      if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data);

        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        navigate('/seatregister');
      } else {
        console.error('Error registering user:', await response.text());
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
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