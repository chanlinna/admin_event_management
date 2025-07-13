import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RoleTable from '../components/RoleTable';
import '../styles/main.css';

const Roles = ({ onLogout }) => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRole, setNewRole] = useState({
    roleName: '',
    permissions: [],
    dbName: '',
    table: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [rolesRes, permissionsRes] = await Promise.all([
          fetch('http://localhost:3000/api/roles', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/permissions', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const rolesData = await rolesRes.json();
        const permissionsData = await permissionsRes.json();
        
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roleName: newRole.roleName })
      });
      
      if (response.ok) {
        const roleData = await response.json();
        
        if (newRole.permissions.length > 0 && newRole.dbName && newRole.table) {
          await Promise.all(
            newRole.permissions.map(permissionName => 
              fetch('http://localhost:3000/api/permissions/assign', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  roleName: newRole.roleName,
                  permissionName,
                  dbName: newRole.dbName,
                  table: newRole.table
                })
              })
            )
          );
        }
        
        const updatedRoles = await fetch('http://localhost:3000/api/roles', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
        
        setRoles(updatedRoles);
        setNewRole({ roleName: '', permissions: [], dbName: '', table: '' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/roles/${roleId}/${roleName}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRoles(roles.filter(role => role.role_id !== roleId));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleViewRole = (roleId) => {
    navigate(`/roles/${roleId}/permissions`);
  };

  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <h1>Roles Management</h1>
        
        <div className="role-actions">
          <button 
            className="action-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Hide Form' : 'Create New Role'}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="create-form">
            {/* ... existing create form ... */}
          </div>
        )}
        
        <RoleTable 
          roles={roles} 
          onDelete={handleDeleteRole} 
          onView={handleViewRole} 
        />
      </div>
    </div>
  );
};

export default Roles;