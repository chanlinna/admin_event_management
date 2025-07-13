import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>
        <li className={location.pathname === '/users' ? 'active' : ''}>
          <Link to="/users">
            <i className="fas fa-users"></i> Users
          </Link>
        </li>
        <li className={location.pathname === '/roles' ? 'active' : ''}>
          <Link to="/roles">
            <i className="fas fa-user-tag"></i> Roles
          </Link>
        </li>
        <li className={location.pathname === '/permissions' ? 'active' : ''}>
          <Link to="/permissions">
            <i className="fas fa-key"></i> Privileges
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;