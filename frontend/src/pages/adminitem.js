import axios from 'axios';
import { useEffect, useState } from 'react';
import "../styles/adminitem.css";
import BASE_URL from "./config.js";

const AdminItem = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/items`);
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Delete a specific item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://croudsource-lost-and-found-platform.onrender.com/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items by name
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-item-container">
      <h1>Items</h1>
      <input
        type="text"
        className="admin-item-search"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredItems.length > 0 ? (
        <div className="item-table-container">
          <table className="item-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
          <div className="scrollable-tbody">
            <table className="item-table">
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="item-avatar">
                        {item.name ? item.name.charAt(0).toUpperCase() : ''}
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="delete-item-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p style={{ color: '#fff', textAlign: 'center' }}>No items found.</p>
      )}
    </div>
  );
};

export default AdminItem;
