import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles/adminuser.css';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://croudsource-lost-and-found-platform.onrender.com/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://croudsource-lost-and-found-platform.onrender.com/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-user-container">
      <h1>Users</h1>
      <input
        type="text"
        className="admin-user-search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredUsers.length > 0 ? (
        <div className="user-table-container">
          <div className="scrollable-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : ''}
                      </div>
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="delete-user-button"
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
        <p style={{ color: '#fff', textAlign: 'center' }}>No users found.</p>
      )}
    </div>
  );
};

export default AdminUser;
