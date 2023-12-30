import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage items
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');

    // Navigate to the login page
    navigate('/login'); // Adjust the route as per your application's route configuration
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
