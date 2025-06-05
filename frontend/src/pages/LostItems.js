// src/pages/LostItemsPage.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode here
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/LostItem.css';

const LostItemsPage = () => {
  const [lostItems, setLostItems] = useState([]);
  const [userName, setUserName] = useState(''); // Set userName from token
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || decoded.email || 'User');
    } else {
      navigate('/login');
    }

    // Fetch lost items
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lostitems/view');
        setLostItems(response.data);
        setFilteredItems(response.data); // Initially set filtered items to all lost items
      } catch (error) {
        console.error('Error fetching lost items:', error);
      }
    };

    fetchItems();
  }, [navigate]);

  
  // Search function for filtering items by name or location
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(lostItems); // If search is empty, show all items
      return;
    }

    const lowerSearch = searchQuery.toLowerCase().split(' '); // Split search into words

    const filtered = lostItems.filter(item => {
      const itemName = item.name?.toLowerCase() || '';
      const itemLocation = item.location?.toLowerCase() || '';

      return lowerSearch.some(word => itemName.includes(word) || itemLocation.includes(word));
    });

    setFilteredItems(filtered);
  };

  return (
    <>
      <Header
        userName={userName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />  
     {/* Lost Items Grid Section */}
<section className="items-grid">
  <h2>Lost Items</h2>
  <div className="grid-container">
    {filteredItems.length > 0 ? (
      filteredItems.map((item) => (
        <div
          key={item._id}
          className="grid-card"
          onClick={() => navigate(`/lost-items/lost/${item._id}`)}
        >
          <img
            src={item.imageUrl || '/placeholder.jpg'}
            alt={item.name}
            className="grid-card-image"
          />
          <div className="grid-card-details">
            <h3>{item.name}</h3>
            <p>{item.location}</p>
            <p className={`status ${item.status}`}>{item.status}</p>
          </div>
          <button className="view-details-btn">View Details</button>
        </div>
      ))
    ) : (
      <p>No lost items available.</p>
    )}
  </div>
</section>

    </>
  );
};

export default LostItemsPage;
