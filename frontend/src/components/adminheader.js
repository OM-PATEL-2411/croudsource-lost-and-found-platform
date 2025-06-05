import React from 'react';

const AdminHeader = ({ onNavChange }) => {
  return (
    <header className="admin-header">
      <h1>Welcome to Admin Dashboard</h1>
      <nav className="admin-nav">
        <ul>
          <li><button onClick={() => onNavChange('users')}>Users</button></li>
          <li><button onClick={() => onNavChange('items')}>Items</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default AdminHeader;
