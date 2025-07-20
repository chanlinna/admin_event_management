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
    table: '',
    withGrantOption: false
  });
  const [error, setError] = useState('');
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
        
        if (!rolesRes.ok) throw new Error('Failed to fetch roles');
        if (!permissionsRes.ok) throw new Error('Failed to fetch permissions');
        
        const rolesData = await rolesRes.json();
        const permissionsData = await permissionsRes.json();
        
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!newRole.roleName.trim()) {
        throw new Error('Role name is required');
      }

      const token = localStorage.getItem('token');
      
      // Create the role
      const response = await fetch('http://localhost:3000/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roleName: newRole.roleName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create role');
      }

      // Assign permissions if any were selected
      if (newRole.permissions.length > 0 && newRole.dbName && newRole.table) {
        const permissionResults = await Promise.all(
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
                table: newRole.table,
                withGrantOption: newRole.withGrantOption
              })
            })
          )
        );
      }
      
      // Refresh the roles list
      const updatedRoles = await fetch('http://localhost:3000/api/roles', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json());
      
      setRoles(updatedRoles);
      setNewRole({ roleName: '', permissions: [], dbName: '', table: '', withGrantOption: false });
      setShowCreateForm(false);
      alert('Role created successfully');
      
    } catch (error) {
      console.error('Error creating role:', error);
      setError(error.message);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!window.confirm(`Are you sure you want to delete role "${roleName}"?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/roles/${roleId}/${roleName}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete role');
      }
      
      setRoles(roles.filter(role => role.role_id !== roleId));
      alert('Role deleted successfully');
    } catch (error) {
      console.error('Error deleting role:', error);
      alert(`Error: ${error.message}`);
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
        
        <div className="user-actions">
          <button 
            className="action-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Hide Form' : 'Create New Role'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {showCreateForm && (
          <div className="create-form">
            <h3>Create New Role</h3>
            <form onSubmit={handleCreateRole}>
              <div className="form-group">
                <label>Role Name*:</label>
                <input
                  type="text"
                  value={newRole.roleName}
                  onChange={(e) => setNewRole({...newRole, roleName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Database Name:</label>
                <input
                  type="text"
                  value={newRole.dbName}
                  onChange={(e) => setNewRole({...newRole, dbName: e.target.value})}
                  placeholder="Enter database name"
                />
              </div>
              <div className="form-group">
                <label>Table Name:</label>
                <input
                  type="text"
                  value={newRole.table}
                  onChange={(e) => setNewRole({...newRole, table: e.target.value})}
                  placeholder="Enter table name"
                />
              </div>
              <div className="form-group">
                <label>Permissions:</label>
                <select
                  multiple
                  className="multi-select"
                  value={newRole.permissions}
                  onChange={(e) => setNewRole({
                    ...newRole,
                    permissions: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {permissions.map(permission => (
                    <option key={permission.permission_id} value={permission.permission_name}>
                      {permission.permission_name}
                    </option>
                  ))}
                </select>
                <small>Hold CTRL/CMD to select multiple permissions</small>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newRole.withGrantOption || false}
                    onChange={(e) => setNewRole({...newRole, withGrantOption: e.target.checked})}
                  />
                  With Grant Option (allows this role to grant the permission to others)
                </label>
              </div>
              <button type="submit" className="submit-button">Create Role</button>
            </form>
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