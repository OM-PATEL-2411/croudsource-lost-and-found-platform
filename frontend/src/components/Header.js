// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ userName, searchQuery, setSearchQuery, onSearch }) => {
  const navigate = useNavigate();
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="header-container">
      {/* Top Header */}
      <div className="top-header">
        <div className="left-section">
          <div className="user-avatar">{firstLetter}</div>
          <span className="welcome-text">Welcome, {userName || 'User'}</span>
        </div>

        <div className="center-section">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="notification-button" onClick={onSearch}>🔍</button>
        </div>

        <div className="right-section">
          <button className="logout-button" onClick={() => {
            localStorage.removeItem('token');
            navigate('/login'); // Redirect to login page on logout
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="navigation-bar">
        <button onClick={() => navigate('/dashboard')} className="nav-link">Dashboard</button>
        <button onClick={() => navigate('/lost-items')} className="nav-link">Lost Items</button>
        <button onClick={() => navigate('/found-items')} className="nav-link">Found Items</button>
        <button onClick={() => navigate('/report-lost')} className="nav-link">Report Lost</button>
        <button onClick={() => navigate('/report-found')} className="nav-link">Report Found</button>
      </nav>
    </header>
  );
};

export default Header;
