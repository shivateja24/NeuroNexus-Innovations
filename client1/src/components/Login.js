// LoginForm.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import './css/LoginForm.css'; // Import the CSS file

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        toast('Login successful');
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user._id);
        navigate('/dashboard');
      } else {
        // Login failed
        toast('Login failed', { type: 'error' });
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <h1 className="title">Project Management Tool</h1>
      <p className="tagline">Assign, Update, Delete your tasks securely</p>

      <label className="label" htmlFor="username">
        Username:
      </label>
      <input
        className="input"
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className="label" htmlFor="password">
        Password:
      </label>
      <input
        className="input"
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="button" type="button" onClick={login}>
        Login
      </button>

      <p className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default LoginForm;
