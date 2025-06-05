// src/pages/Dashboard.js
import axios from 'axios'; // Import axios to fetch data
import { jwtDecode } from 'jwt-decode'; // ✅ Correct
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [items, setItems] = useState([]); // To store items from the backend
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [filteredItems, setFilteredItems] = useState([]); // To store filtered items

  // Check for user authentication on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        const nameOrEmail = decoded.name || decoded.email || 'User';
        setUserName(nameOrEmail);
      } catch (err) {
        console.error("Invalid token:", err);
        navigate('/login');
      }
    }
    // Fetch items from the backend when the component mounts
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://croudsource-lost-and-found-platform.onrender.com/routes/items'); // Replace with your actual API route
        setItems(response.data); // Set the state with the fetched items
        setFilteredItems(response.data); // Initially, show all items
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems(); // Call fetchItems on mount
  }, [navigate]);

  const firstLetter = userName.charAt(0).toUpperCase();

   // Search function
   const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(items); // If search is empty, show all items
      return;
    }

    const lowerSearch = searchQuery.toLowerCase().split(' '); // Split search into words

    const filtered = items.filter(item => {
      const itemName = item.name?.toLowerCase() || '';
      const itemLocation = item.location?.toLowerCase() || '';

      // Check if any word from searchQuery matches item name or location
      return lowerSearch.some(word => itemName.includes(word) || itemLocation.includes(word));
    });

    setFilteredItems(filtered);
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="header-container">
        {/* Top Header */}
        <div className="top-header">
          <div className="left-section">
            <div className="user-avatar">{firstLetter}</div>
            <span className="welcome-text">Welcome, {userName}</span>
          </div>

          <div className="center-section">
            <input
              type="text"
              placeholder="Search by name or location..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="notification-button" onClick={handleSearch}>🔍</button>
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

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to the Lost & Found Platform</h1>
        <p className="hero-description">Find and report lost or found items quickly and easily.</p>
      </section>

      {/* Items Grid Section */}
      <section className="items-grid">
        <h2>Recent Items</h2>
        <div className="grid-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="grid-card" onClick={() => navigate(`/item/${item._id}`)}>
                <img src={item.imageUrl} alt={item.name} className="grid-card-image" />
                <div className="grid-card-details">
                  <h3>{item.name}</h3>
                  <p>{item.location}</p>
                  <p className={`status ${item.status}`}>{item.status}</p>
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            ))
          ) : (
            <p>No items available.</p>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Lost & Found Platform | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Dashboard;
