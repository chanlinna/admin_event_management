import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PermissionTable from '../components/PermissionTable';
import '../styles/main.css';

const Permissions = ({ onLogout }) => {
  const [permissions, setPermissions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [newPermission, setNewPermission] = useState({
    name: ''
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/permissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
    
    fetchPermissions();
  }, []);

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newPermission.name })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPermissions([...permissions, { 
          permission_id: data.permission_id, 
          permission_name: newPermission.name
        }]);
        setNewPermission({ name: '' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating permission:', error);
    }
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    setNewPermission({ name: permission.permission_name });
    setShowCreateForm(true);
  };

  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/permissions/${editingPermission.permission_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newPermission.name })
      });
      
      if (response.ok) {
        const updatedPermissions = permissions.map(perm => 
          perm.permission_id === editingPermission.permission_id 
            ? { ...perm, permission_name: newPermission.name } 
            : perm
        );
        setPermissions(updatedPermissions);
        setNewPermission({ name: '' });
        setEditingPermission(null);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  };

  const handleDeletePermission = async (permissionId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/permissions/${permissionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPermissions(permissions.filter(perm => perm.permission_id !== permissionId));
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <h1>Permissions Management</h1>
        
        <div className="permission-actions">
          <button 
            className="action-button"
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingPermission(null);
              setNewPermission({ name: '' });
            }}
          >
            {showCreateForm ? 'Hide Form' : 'Create New Permission'}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="create-form">
            <h3>{editingPermission ? 'Edit Permission' : 'Create New Permission'}</h3>
            <form onSubmit={editingPermission ? handleUpdatePermission : handleCreatePermission}>
              <div className="form-group">
                <label>Permission Name:</label>
                <input
                  type="text"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission({name: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                {editingPermission ? 'Update Permission' : 'Create Permission'}
              </button>
              {editingPermission && (
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setEditingPermission(null);
                    setNewPermission({ name: '' });
                    setShowCreateForm(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}
        
        <PermissionTable 
          permissions={permissions} 
          onDelete={handleDeletePermission}
          onEdit={handleEditPermission}
        />
      </div>
    </div>
  );
};

export default Permissions;