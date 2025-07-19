import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UserTable from '../components/UserTable';
import '../styles/main.css';

const Users = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    roleName: ''
  });
  const [editingUser, setEditingUser] = useState({
    userId: '',
    username: '',
    newUsername: '',
    password: '',
    roleName: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [usersResponse, rolesResponse] = await Promise.all([
          fetch('http://localhost:3000/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/roles', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const usersData = await usersResponse.json();
        const rolesData = await rolesResponse.json();
        
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedRole = roles.find(role => role.role_name === newUser.roleName);
      
      if (!newUser.username || !newUser.password) {
        throw new Error('Username and password are required');
      }

      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          roleId: selectedRole?.role_id || null
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers([...users, { 
          user_id: data.userId, 
          username: newUser.username,
          role_name: newUser.roleName
        }]);
        setNewUser({ username: '', password: '', roleName: '' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      userId: user.user_id,
      username: user.username,
      newUsername: user.username,
      password: '',
      roleName: user.role_name || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const selectedRole = roles.find(role => role.role_name === editingUser.roleName);
      
      if (editingUser.newUsername === editingUser.username && 
          !editingUser.password && 
          editingUser.roleName === (users.find(u => u.user_id === editingUser.userId)?.role_name) || '') {
        throw new Error('No changes detected');
      }

      const response = await fetch(`http://localhost:3000/api/users/${editingUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newUsername: editingUser.newUsername.trim() || editingUser.username,
          newPassword: editingUser.password.trim() || null,
          roleId: selectedRole?.role_id || null,
          oldUsername: editingUser.username
        })
      });
      
      if (response.ok) {
        const updatedUsers = users.map(user => 
          user.user_id === editingUser.userId ? { 
            ...user, 
            username: editingUser.newUsername.trim() || user.username,
            role_name: editingUser.roleName 
          } : user
        );
        setUsers(updatedUsers);
        setShowEditForm(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.message);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/users/${userId}/${username}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.user_id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRevokeRole = async (userId, username) => {
    if (!window.confirm('Are you sure you want to revoke this role?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/api/users/${userId}/revoke-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });
      
      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role_name: null } : user
      ));
    } catch (error) {
      console.error('Error revoking role:', error);
      alert(error.message);
    }
  };

  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleRoleAssignment = async () => {
    if (!selectedRole) return;
    
    try {
      const token = localStorage.getItem('token');
      const roleObj = roles.find(r => r.role_name === selectedRole);
      
      const response = await fetch(
        `http://localhost:3000/api/users/assign-role`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: selectedUser.username,
            roleId: roleObj.role_id
          })
        }
      );

      if (response.ok) {
        setUsers(users.map(user => 
          user.user_id === selectedUser.user_id ? { 
            ...user, 
            role_name: selectedRole 
          } : user
        ));
        setShowRoleModal(false);
        setSelectedRole('');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      alert(error.message);
    }
  };

  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-content">
        <h1>Users Management</h1>
        
        <div className="user-actions">
          <button 
            className="action-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Hide Form' : 'Create New User'}
          </button>
        </div>
        
        {showCreateForm && (
          <div className="create-form">
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Username*:</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password*:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={newUser.roleName}
                  onChange={(e) => setNewUser({...newUser, roleName: e.target.value})}
                >
                  <option value="">No Role</option>
                  {roles.map(role => (
                    <option key={role.role_id} value={role.role_name}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="submit-button">Create User</button>
            </form>
          </div>
        )}
        
        {showEditForm && (
          <div className="edit-form">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Current Username:</label>
                <input
                  type="text"
                  value={editingUser.username}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>New Username:</label>
                <input
                  type="text"
                  value={editingUser.newUsername}
                  onChange={(e) => setEditingUser({...editingUser, newUsername: e.target.value})}
                  placeholder={editingUser.username}
                />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current):</label>
                <input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={editingUser.roleName}
                  onChange={(e) => setEditingUser({...editingUser, roleName: e.target.value})}
                >
                  <option value="">No Role</option>
                  {roles.map(role => (
                    <option key={role.role_id} value={role.role_name}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Update User</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {showRoleModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Assign Role to {selectedUser?.username}</h3>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.role_id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button 
                  onClick={handleRoleAssignment}
                  disabled={!selectedRole}
                  className="submit-button"
                >
                  Assign
                </button>
                <button 
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedRole('');
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <UserTable 
          users={users} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onRevokeRole={handleRevokeRole}
          onAssignRole={handleAssignRole}
        />
      </div>
    </div>
  );
};

export default Users;