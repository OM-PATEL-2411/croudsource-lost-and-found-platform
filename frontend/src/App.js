import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';
import Dashboard from './pages/Dashboard'; // Import Dashboard
import FoundItems from './pages/FoundItems';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import LostFoundItemDetails from './pages/LostFoundItemDetails';
import LostItems from './pages/LostItems';
import Register from './pages/Register';
import ReportFound from './pages/ReportFound';
import ReportLost from './pages/ReportLost';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
       <Routes>
        {/* Route for Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Route for Register Page */}
        <Route path="/register" element={<Register />} />
        
        {/* Route for Dashboard Page (after successful login) */}
        
    {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/lost-items" element={<PrivateRoute element={<LostItems />} />} />
        <Route path="/found-items" element={<PrivateRoute element={<FoundItems />} />} />
        <Route path="/report-lost" element={<PrivateRoute element={<ReportLost />} />} />
        <Route path="/report-found" element={<PrivateRoute element={<ReportFound />} />} />
        <Route path="/item/:itemId" element={<PrivateRoute element={<ItemDetails/>}/>} />
        <Route path="/found-items/:itemType/:itemId"element={<PrivateRoute element={<LostFoundItemDetails/>}/>}/>
        <Route path="/lost-items/:itemType/:itemId"element={<PrivateRoute element={<LostFoundItemDetails/>}/>}/>
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-panel" element={<AdminPanelPage />} />

        {/* Redirect any other routes to login page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
