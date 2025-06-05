// adminpanel.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminHeader from '../components/adminheader';
import '../styles/AdminPanelPage.css';
import AdminItem from './adminitem';
import AdminUser from './adminuser';
const AdminPanel = () => {
  const [view, setView] = useState('users'); // default view
  const navigate = useNavigate(); // Initialize the navigate function


  useEffect(() => {
    // Check if the user is logged in
    const isAdmin = localStorage.getItem('isAdmin');
    console.log('Admin Login Status:', isAdmin); // Add this log for debugging
    
    // If not logged in, redirect to login page
    if (!isAdmin) {
      navigate('/admin-login');
    }
  }, [navigate]); // Dependency on navigate to ensure it runs on component mount


  return (
    <div>
      <AdminHeader onNavChange={setView} />
      {view === 'users' && <AdminUser />}
      {view === 'items' && <AdminItem />}
    </div>
  );
};

export default AdminPanel;
