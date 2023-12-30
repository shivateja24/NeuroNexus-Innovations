// RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/register.css';

 
const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    reenterPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.reenterPassword) {
        toast.error("Passwords don't match");
        return;
      }

      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Redirect to login page after successful registration
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('An error occurred during registration, try changing username');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="username">
          Username:
        </label>
        <input
          className="input"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
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
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label className="label" htmlFor="reenterPassword">
          Re-enter Password:
        </label>
        <input
          className="input"
          type="password"
          id="reenterPassword"
          name="reenterPassword"
          value={formData.reenterPassword}
          onChange={handleChange}
          required
        />

        <button className="button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
