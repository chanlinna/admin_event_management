import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/main.css';

const Dashboard = ({ onLogout }) => {
  const [userCount, setUserCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user count
        const usersResponse = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const usersData = await usersResponse.json();
        setUserCount(usersData.length);
        
        // Fetch role count
        const rolesResponse = await fetch('http://localhost:3000/api/roles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const rolesData = await rolesResponse.json();
        setRoleCount(rolesData.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <h1>Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{userCount}</p>
          </div>
          <div className="stat-card">
            <h3>Total Roles</h3>
            <p>{roleCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;